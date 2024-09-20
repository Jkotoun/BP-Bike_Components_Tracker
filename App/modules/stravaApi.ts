import axios from 'axios';
import { makeRedirectUri, useAuthRequest, exchangeCodeAsync, refreshAsync, RefreshTokenRequestConfig } from 'expo-auth-session';
import Constants from 'expo-constants';
import {updateUserStravaTokens, getLoggedUserData} from "./firestoreActions"
import { getAuth } from 'firebase/auth';

/**
 * checks if user has account connected to strava
 * @param User user data from db
 * @returns boolean saying if user has account connected to strava
 */
export function isStravaUser(User)
{
  return User.stravaAuth || User.stravaConnected
}

/**
 * Checks if users strava api access token has expired
 * @param User User data from db
 * @returns boolean saying if token has expired
 */
function tokenExpired(User)
{
  if(isStravaUser(User))
  {
    return User.stravaInfo.accessTokenExpiration.toDate() <= new Date()
  } 
  else
  {
    throw new Error("User has not connected strava account")
  }
}

/**
 * refresh users access token and stores it to db
 * @param User React context user state object
 * @param setUser react context user state setter function
 * @returns new refresh and access tokens
 */
export async function refreshAccessToken(User,setUser: Function )
{
  const tokens = await refreshAsync(
    {
      clientId: process.env.EXPO_PUBLIC_STRAVA_APP_CLIEND_ID,
      refreshToken: User.stravaInfo.refreshToken,
      extraParams: {
        client_secret: process.env.EXPO_PUBLIC_STRAVA_APP_SEC
      },
    },
    { tokenEndpoint: 'https://www.strava.com/oauth/token' }
  );
  
  let updatedStravaInfo = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenExpiration:new Date((tokens.expiresIn + tokens.issuedAt)*1000) //date constructor accepts miliseconds
  }


  await updateUserStravaTokens(updatedStravaInfo)
  const updatedUserData = await getLoggedUserData()
  setUser({...updatedUserData, ...getAuth().currentUser})

  return updatedStravaInfo
}

/**
 * 
 * @returns authentication request instance
 */
export function stravaAuthReq()
{
    return useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_STRAVA_APP_CLIEND_ID,
      scopes: ['profile:read_all,activity:read_all'],
       redirectUri: makeRedirectUri({
        native: "bikecomponentsmanager://redirect",
      })
    },
    {
      authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
      tokenEndpoint: 'https://www.strava.com/oauth/token',
      revocationEndpoint: 'https://www.strava.com/oauth/deauthorize',
    }
  );
}



/**
 * 
 * @param authCode autorization token
 * @returns access token, its expiration and refresh token
 */
export async function getTokens(authCode) {
    const tokens = await exchangeCodeAsync(
      {
        clientId: process.env.EXPO_PUBLIC_STRAVA_APP_CLIEND_ID,
        redirectUri: makeRedirectUri({
            native: "bikecomponentsmanager://redirect",
          }),
        code: authCode,
        extraParams: {

          // You must use the extraParams variation of clientSecret.
          // Never store your client secret on the client.
          client_secret: process.env.EXPO_PUBLIC_STRAVA_APP_SEC
        },
      },
      { tokenEndpoint: 'https://www.strava.com/oauth/token' }
    );
    return tokens
  
  }

  /**
   * get logged athlete data from strava api
   */
export function getCurrentlyAuthorizedAthlete(accessToken)
{
  return axios.get('https://www.strava.com/api/v3/athlete', {
    headers:{
        'Authorization': 'Bearer ' + accessToken
    }
}).then(response => {
    if(response.status == 200)
    {
        return response.data;
    }
    else
    {
        throw new Error(response.statusText)
    }
})
}

/**
 * Generic strava api request
 * @param User React context user state object
 * @param setUser react context user state setter function
 * @param path strava api endpoint relative path
 * @returns request response
 */
async function stravaApiRequest(User, setUser, path)
{
  if(isStravaUser)
  {
    let authToken = User.stravaInfo.accessToken
    if(tokenExpired(User))
    {
      authToken = (await refreshAccessToken(User, setUser)).accessToken
    }

  
    return axios.get('https://www.strava.com/api/v3/' + path, {
      headers:{
          'Authorization': 'Bearer ' + authToken
      }
  }).then(response => {
      if(response.status == 200)
      {
          return response.data;
      }
      else
      {
          throw new Error(response.statusText)
      }
  }) 
  }
  else
  {
    throw new Error("Strava api request failed, logged user has not connected account to strava")
  }
}
/**
 * 
 * @param User React context user state object
 * @param setUser react context user state setter function
 * @returns all logged users strava activites
 */
export async function getAllActivities(User, setUser)
{

  let current_page = 1
   
  let all_activities = [], page_activities
  while((page_activities = await stravaApiRequest(User, setUser, `athlete/activities?per_page=100&page=${current_page}`)).length!=0)
  {
    all_activities = all_activities.concat(page_activities)
    current_page+=1
  }
  
  return all_activities
  
}
/**
 * 
 * @param User React context user state object
 * @param setUser react context user state setter function
 * @returns get logged user strava info
 */
export async function getAthlete(User, setUser: Function)
{
  return stravaApiRequest(User, setUser, "athlete")
}

/**
 * 
 * @param User React context user state object
 * @param setUser react context user state setter function
 * @returns logged user strava bikes
 */
export async function getAllBikes(User, setUser)
{
  let athlete = await getAthlete(User, setUser)
  return athlete["bikes"]
}


/**
 * 
 * @param bikeStravaId bike strava id
 * @param User React context user state object
 * @param setUser react context user state setter function
 * @returns strava bike detail info
 */
export async function getStravaGear(bikeStravaId, User, setUser)
{
  return stravaApiRequest(User, setUser, ("gear/" +bikeStravaId))

}

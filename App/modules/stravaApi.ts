import axios from 'axios';
import * as React from 'react';
import { makeRedirectUri, useAuthRequest, exchangeCodeAsync, refreshAsync, RefreshTokenRequestConfig } from 'expo-auth-session';
import Constants from 'expo-constants';
import { AuthenticatedUserContext } from '../../context'
import {updateUserStravaTokens, getLoggedUserData} from "./firestoreActions"
import { getAuth } from 'firebase/auth';

export function isStravaUser(User)
{
  return User.stravaAuth || User.stravaConnected
}


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

export async function refreshAccessToken(User,setUser: Function )
{
  const tokens = await refreshAsync(
    {
      clientId: Constants.manifest.extra.stravaClientId,
      refreshToken: User.stravaInfo.refreshToken,
      extraParams: {
        client_secret: Constants.manifest.extra.stravaSecret
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


export function stravaAuthReq()
{
  
    return useAuthRequest(
    {
      clientId: Constants.manifest.extra.stravaClientId,
      scopes: ['profile:read_all,activity:read_all'],
       redirectUri: makeRedirectUri({
        native: "bikecomponentsmanager://redirect",
        useProxy:false
      })
    },
    {
      authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
      tokenEndpoint: 'https://www.strava.com/oauth/token',
      revocationEndpoint: 'https://www.strava.com/oauth/deauthorize',
    }
  );
}




export async function getTokens(authCode) {
    const tokens = await exchangeCodeAsync(
      {
        clientId: Constants.manifest.extra.stravaClientId,
        redirectUri: makeRedirectUri({
            native: "bikecomponentsmanager://redirect"
          }),
        code: authCode,
        extraParams: {

          // You must use the extraParams variation of clientSecret.
          // Never store your client secret on the client.
          client_secret: Constants.manifest.extra.stravaSecret
        },
      },
      { tokenEndpoint: 'https://www.strava.com/oauth/token' }
    );
    return tokens
  
  }

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

export async function getAllActivities(User, setUser)
{
  return stravaApiRequest(User, setUser, "athlete/activities")
  
}

export async function getAthlete(User, setUser: Function)
{
  return stravaApiRequest(User, setUser, "athlete")
}

export async function getAllBikes(User, setUser)
{
  let athlete = await getAthlete(User, setUser)
  return athlete["bikes"]
}



export async function getStravaGear(bikeStravaId, User, setUser)
{
  return stravaApiRequest(User, setUser, ("gear/" +bikeStravaId))

}

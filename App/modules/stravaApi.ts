import axios from 'axios';
import { makeRedirectUri, useAuthRequest, exchangeCodeAsync } from 'expo-auth-session';
import Constants from 'expo-constants';


export function authReq()
{
    return useAuthRequest(
    {
      clientId: Constants.manifest.extra.stravaClientId,
      scopes: ['profile:read_all'],
       redirectUri: makeRedirectUri({
        native: "bikecomponentsmanager://stravaAuth"
      })
    },
    {
      authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
      tokenEndpoint: 'https://www.strava.com/oauth/token',
      revocationEndpoint: 'https://www.strava.com/oauth/deauthorize',
    }
  );
}

export function getAthlete(accessToken)
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
            //TODO error type
            throw new Error(response.statusText)
        }
    })
}


export async function getTokens(authCode) {
    const tokens = await exchangeCodeAsync(
      {
        clientId: Constants.manifest.extra.stravaClientId,
        redirectUri: makeRedirectUri({
            native: "bikecomponentsmanager://stravaAuth"
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
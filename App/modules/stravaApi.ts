import axios from 'axios';
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
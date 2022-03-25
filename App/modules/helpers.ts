export function rideSecondsToString(rideSeconds)
{
    return (Math.floor((rideSeconds) / 3600) + "h " + Math.floor(((rideSeconds)% 3600) / 60) + "m")
}

export function rideDistanceToString(distance)
{
    return ((distance)/1000).toFixed(2) + " km"
}

export function activeScreenName(navigationState) :string
{
    if (navigationState) 
    {
      if (navigationState.routes[navigationState.index].state) 
      {
        return activeScreenName(navigationState.routes[navigationState.index].state)
      }
      else 
      {
        return navigationState.routes[navigationState.index].name
      }
    }
}

export function formatDateTime(date: Date) {
  const minutes = date.getMinutes()
  const hours = date.getHours()
  return  formatDate(date) +  " " + hours + ":" + minutes;
}

export function formatDate(date:Date){
  const day = date.getDate()
  const month = date.getMonth()+1
  const year = date.getFullYear()
  return day + ". " + month + ". " + year
}

export default activeScreenName;
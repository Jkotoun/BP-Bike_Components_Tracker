/**
 * Convert ride time to string in hours and minutes
 * @param rideSeconds ride time in seconds 
 * @returns ride time in seconds to string
 */
export function rideSecondsToString(rideSeconds)
{
    return (Math.floor((rideSeconds) / 3600) + " h " + Math.floor(((rideSeconds)% 3600) / 60) + " m")
}
/**
 * Converts ride distance in meters to string in km
 * @param distance distance in meters
 * @returns ride distance in string
 */
export function rideDistanceToString(distance)
{
    return ((distance)/1000).toFixed(2) + " km"
}

/**
 * Current screen name from navigation state
 * @param navigationState navigation state from useNavigationState hook
 * @returns current screen name
 */
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
/**
 * formats hours and minutes to dd.mm.yyyy hh:mm format
 * @param date datetime to format
 * @returns formatted datetime in string
 */
export function formatDateTime(date: Date) {
  const minutes = date.getMinutes()
  const hours = date.getHours()
  return  formatDate(date) +  " " + hours + ":" + minutes;
}
/**
 * Formats datetime to dd.mm.yyyy format
 * @param date date to format
 * @returns formatted date in string
 */
export function formatDate(date:Date){
  const day = date.getDate()
  const month = date.getMonth()+1
  const year = date.getFullYear()
  return day + ". " + month + ". " + year
}

export default activeScreenName;
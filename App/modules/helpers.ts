export function rideSecondsToString(rideSeconds)
{
    return (Math.floor((rideSeconds) / 3600) + " h " + Math.floor(((rideSeconds)% 3600) / 60) + " m")
}

export function rideDistanceToString(distance)
{
    return ((distance)/1000).toFixed(2) + " km"
}
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

export default activeScreenName;
import React from "react";

// set the defaults
export const AuthenticatedUserContext = React.createContext({  
  IsLoggedIn: false,
  setIsLoggedIn: (IsLoggedIn: boolean) => {},
  User: {},
  setUser: (User: {}) => {}
});

export const AuthenticatedUserProvider = ({children}) => {
  const [User, setUser] = React.useState(null);
  const [IsLoggedIn, setIsLoggedIn] = React.useState(false);
  const userContextValues = {
    IsLoggedIn,
    setIsLoggedIn,
    User,
    setUser
    
  }
  
  return (
    <AuthenticatedUserContext.Provider value={userContextValues}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
}





import React from "react";

// set the defaults
const AuthenticatedContext = React.createContext({
  IsLoggedIn: false,
  setIsLoggedIn: (IsLoggedIn: boolean) => {},
  User: {},
  setUser: (User: {}) => {}
});

export default AuthenticatedContext;

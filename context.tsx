import React from "react";

// set the defaults
const AuthenticatedContext = React.createContext({
  authenticated: false,
  setAuthenticated: (authenticated: boolean) => {}
});

export default AuthenticatedContext;

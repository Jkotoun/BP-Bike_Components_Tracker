import * as React from 'react';


import { AuthenticatedUserProvider } from './context';
import Root from './Root'

export default function App() {
  // if (initializing) return null;

  return (
    <AuthenticatedUserProvider>
      <Root />
    </AuthenticatedUserProvider>
  );
}

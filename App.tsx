import * as React from 'react';
import { LogBox } from 'react-native';

import { AuthenticatedUserProvider } from './context';
import Root from './Root'
export default function App() {
  //dont show warnings in app
  LogBox.ignoreAllLogs();

  return (
    <AuthenticatedUserProvider>
      <Root />
    </AuthenticatedUserProvider>
  );
}

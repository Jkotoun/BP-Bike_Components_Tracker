import 'expo-dev-client';
import * as React from 'react';
import { LogBox } from 'react-native';

import { AuthenticatedUserProvider } from './context';
import Root from './Root'
export default function App() {
  //dont show warnings in app
  LogBox.ignoreLogs(['Setting a timer for a long period of time'])

  return (
    <AuthenticatedUserProvider>
      <Root />
    </AuthenticatedUserProvider>
  );
}

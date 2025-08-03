/**
 * Dagestan Audio Guide Mobile App
 * Main application entry point
 */

import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      <AppNavigator />
    </ErrorBoundary>
  );
};

export default App;

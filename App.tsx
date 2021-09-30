import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';

import './androidIntlPolyfill';
import { AuthContext, useAuthInit } from './hooks/useAuth';
//import useCachedResources from './hooks/useCachedResources';
import './ignoreReactQueryLongTimerWarning';
import Navigation from './navigation';

// For fetching, caching and updating data
const queryClient = new QueryClient();

export default function App() {
  // We don't need to load any resources, yet:
  const isLoadingComplete = true;//useCachedResources();
  const authValue = useAuthInit();
  if (!isLoadingComplete || authValue.isLoading) {
    return null;
  } else {
    return (
      <AuthContext.Provider value={authValue}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <PaperProvider>
              <Navigation />
              <StatusBar />
            </PaperProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </AuthContext.Provider>
    );
  }
}

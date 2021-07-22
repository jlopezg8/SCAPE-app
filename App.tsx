import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';

import './androidIntlPolyfill';
//import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';

// For fetching, caching and updating data
const queryClient = new QueryClient();

export default function App() {
  // We don't need to load any resources, yet:
  const isLoadingComplete = true;//useCachedResources();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <PaperProvider>
            <Navigation />
            <StatusBar />
          </PaperProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    );
  }
}

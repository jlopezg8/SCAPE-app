// https://testing-library.com/docs/react-native-testing-library/setup

import { render } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';

function AllTheProviders({ children }) {
  return (
    <QueryClientProvider client={createQueryClient()}>
      {/*
        * how to properly mock this package? · Issue #31 · th3rdwave/react-native-safe-area-context
        * https://github.com/th3rdwave/react-native-safe-area-context/issues/31
        */}
      <SafeAreaProvider
        initialSafeAreaInsets={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <PaperProvider>
          {children}
        </PaperProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}

function createQueryClient() {
  /*
   * Solves "Jest did not exit one second after the test run has completed." issue:
   * "The problem is setTimeout for cacheTime which is 5 minutes by default.
   * When I set cacheTime to 0 jest stops complaining."
   * See more: https://github.com/tannerlinsley/react-query/issues/1847#issuecomment-882481432
   */
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 0,
        retry: false, // https://react-query.tanstack.com/guides/testing#turn-off-retries
      },
    },
  });
  // https://react-query.tanstack.com/guides/testing#turn-off-network-error-logging
  setLogger({
    log: console.log,
    warn: console.warn,
    // ✅ no more errors on the console
    error: () => {},
  });
  return queryClient;
}

function customRender(ui, options) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };

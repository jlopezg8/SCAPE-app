// https://testing-library.com/docs/react-native-testing-library/setup

import { render } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';

const AllTheProviders = ({children}) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
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

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };

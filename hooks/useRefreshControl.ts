import React from 'react';

export default function useRefreshControl(refetch: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, []);
  return [refreshing, onRefresh] as const;
}

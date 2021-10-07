import { useFocusEffect } from '@react-navigation/native';
import { setStatusBarStyle } from 'expo-status-bar';
import React from 'react';

export default function useLightStatusBar() {
  useFocusEffect(
    React.useCallback(() => {
      setStatusBarStyle('light');
      return () => { setStatusBarStyle('auto'); };
    }, [])
  );
}

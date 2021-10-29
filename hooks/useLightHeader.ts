import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { setStatusBarStyle } from 'expo-status-bar';
import React from 'react';

export default function useLightHeader() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  useFocusEffect(
    React.useCallback(() => {
      setStatusBarStyle('light');
      navigation.setOptions({ headerTintColor: 'white' });
      return () => { setStatusBarStyle('auto'); };
    }, [])
  );
}

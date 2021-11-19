import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';

export default function useFABGroup() {
  /*
   * In order for the scrim to conceal the navigation bar, we need to wrap the
   * FAB.Group component with the Portal component. However, this results in
   * the FAB rendering on other screens (since it's been "portaled" out of the
   * screen that renders it). We can address this by hiding the FAB whenever
   * the screen that renders it isn't focused.
   */
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(navigation.isFocused());
  useFocusEffect(
    React.useCallback(() => {
      setVisible(true);
      return () => setVisible(false);
    }, [])
  );

  const [open, setOpen] = React.useState(false);

  return { visible, setVisible, open, setOpen };
}

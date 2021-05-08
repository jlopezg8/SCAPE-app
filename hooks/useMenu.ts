import React from 'react';

export default function useMenu() {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const closeMenuAfter = (fn: () => void) => () => { fn(); closeMenu(); };
  return { visible, openMenu, closeMenu, closeMenuAfter };
}

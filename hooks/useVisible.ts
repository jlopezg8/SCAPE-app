import React from 'react';

export default function useVisible() {
  const [visible, setVisible] = React.useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const closeAfter = (fn: () => void) => () => { fn(); close(); };
  return { visible, open, close, closeAfter };
}

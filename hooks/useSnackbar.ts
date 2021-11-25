import React from 'react';

import useVisible from './useVisible';

export default function useSnackbar() {
  const snackbar = useVisible();
  const [message, setMessage] = React.useState('');
  const close = snackbar.closeAfter(() => setMessage(''));
  React.useEffect(() => {
    if (message) {
      snackbar.open();
    }
  }, [message]);
  return Object.assign(snackbar, { close, message, setMessage });
}

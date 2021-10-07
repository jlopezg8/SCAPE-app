import React from 'react';

import useVisible from './useVisible';

export default function useSnackbar() {
  const snackbar = useVisible();
  const [message, setMessage] = React.useState('');
  React.useEffect(() => {
    if (message) {
      snackbar.open();
    }
  }, [message]);
  return Object.assign(snackbar, { message, setMessage });
}

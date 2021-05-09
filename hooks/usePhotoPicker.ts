import React from 'react';

export default function usePhotoPicker() {
  const [base64Photo, setBase64Photo] =
    React.useState<string | undefined>(undefined);
  const [status, setStatus] = React.useState('');
  return {
    base64Photo,
    setBase64Photo,
    status,
    setStatus,
    hasStatus: Boolean(status),
    clearStatus: () => setStatus(''),
  };
}

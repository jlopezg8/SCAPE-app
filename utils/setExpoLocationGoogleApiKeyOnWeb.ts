import { setGoogleApiKey } from 'expo-location';
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  (async function () {
    const { default: requireEnvVar } = await import('./requireEnvVar');
    const googleApiKey = requireEnvVar('GOOGLE_MAPS_API_KEY');
    setGoogleApiKey(googleApiKey);
  })();
}

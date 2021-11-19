import { setGoogleApiKey } from 'expo-location';
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  (async function () {
    // https://github.com/goatandsheep/react-native-dotenv#typescript
    // @ts-ignore: Option 1 still requires us to specify types manually
    const { GOOGLE_MAPS_API_KEY } = await import('react-native-dotenv');
    setGoogleApiKey(GOOGLE_MAPS_API_KEY);
  })();
}

import * as Location from 'expo-location';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { LatLng } from 'react-native-maps';

import { TextField, TextFieldProps } from '../components/inputs';
import { HelperText } from '../components/misc';
import Layout from '../constants/Layout';
// Currently we don't have a Google API key with billing enabled:
//import '../utils/setExpoLocationGoogleApiKeyOnWeb';
import CoordinatePicker from './CoordinatePicker';

interface CoordinateProps {
  coordinate: LatLng | undefined;
  setCoordinate: (coordinate: LatLng) => void;
  helperText?: string;
  error?: boolean;
  errorText?: string;
}

type MessageSetter = (message: string) => void;

export interface PlacePickerProps {
  addressTextFieldProps: TextFieldProps;
  coordinateProps: CoordinateProps;
  setMessage?: MessageSetter;
}

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
 *
 * `'expo-location'.requestForegroundPermissionsAsync:
 *   () => Promise<{ status: 'granted' | 'denied' | 'undetermined' }>` can be
 *   mocked
 *
 * `'expo-location'.getCurrentPositionAsync:
 *   (options: { accuracy: 1..6 }) => Promise<{ coords: LatLng }>` can be
 *   mocked
 *
 * `'expo-location'.geocodeAsync: (address: string) => Promise<LatLng>` can be
 *   mocked
 *
 * "No setup required for use within the Expo Go app. [...] Web is
 * experimental! We do not recommend using this library on web yet."
 * (https://docs.expo.dev/versions/v41.0.0/sdk/map-view/)
 */
export default function PlacePicker(props: PlacePickerProps) {
  const {
    addressTextFieldProps,
    searchAddress,
    mapRef,
    coordinate,
    setCoordinate,
    foundLocations,
    locationPermissionsGranted,
    coordinatePickerHelperTextProps,
  } = usePlacePicker(props);
  return <>
    <AddressTextField
      props={addressTextFieldProps}
      searchAddress={searchAddress}
    />
    <CoordinatePicker
      mapRef={mapRef}
      coordinate={coordinate}
      setCoordinate={setCoordinate}
      foundLocations={foundLocations}
      locationPermissionsGranted={locationPermissionsGranted}
    />
    <CoordinatePickerHelperText props={coordinatePickerHelperTextProps} />
  </>;
}

function usePlacePicker(
  {
    addressTextFieldProps,
    coordinateProps,
    setMessage = () => {},
  }: PlacePickerProps
) {
  const { coordinate, setCoordinate } = coordinateProps;
  const mapRef = React.useRef<MapView>(null);
  const locationPermissionsGranted = useLocationPermissions(setMessage);
  const [searchAddress, foundLocations] = useSearchAddress(
    setCoordinate, mapRef, locationPermissionsGranted, setMessage);
  return {
    addressTextFieldProps,
    searchAddress,
    mapRef,
    coordinate,
    setCoordinate,
    foundLocations,
    locationPermissionsGranted,
    coordinatePickerHelperTextProps: coordinateProps,
  };
}

function useLocationPermissions(setMessage: MessageSetter) {
  const [permissionsGranted, setPermissionsGranted] = React.useState(false);
  React.useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status === 'granted') {
        setPermissionsGranted(true);
      } else {
        setMessage(
          'Permite el acceso a tu ubicación para encontrarla en el mapa');
      }
    });
  });
  return permissionsGranted;
}

function useSearchAddress(
  setCoordinate: CoordinateProps['setCoordinate'],
  mapRef: React.RefObject<MapView>,
  locationPermissionsGranted: boolean,
  setMessage: MessageSetter,
) {
  const [foundLocations, setFoundLocations] = React.useState<LatLng[]>([]);
  const searchAddress = React.useCallback(async (address: string) => {
    // On Android, you must request a location permission for geocoding:
    if (Platform.OS === 'android' && !locationPermissionsGranted) {
      setMessage('Para buscar una dirección permite el acceso a la ubicación');
    // Currently we don't have a Google API key with billing enabled:
    } else if (Platform.OS === 'web') {
      setMessage('Actualmente no es posible buscar direcciones en la web');
    } else {
      const foundLocations = await Location.geocodeAsync(address);
      if (foundLocations.length >= 1) {
        setCoordinate(foundLocations[0]);
        setFoundLocations(foundLocations);
        mapRef.current?.fitToCoordinates(foundLocations);
      } else {
        setMessage('La dirección no fue encontrada');
      }
    }
  }, [locationPermissionsGranted]);
  return [searchAddress, foundLocations] as const;
}

interface AddressTextFieldProps {
  props: PlacePickerProps['addressTextFieldProps'];
  searchAddress: (address: string) => Promise<void>;
}

function AddressTextField({ props, searchAddress }: AddressTextFieldProps) {
  const [searching, setSearching] = React.useState(false);
  const { value: address } = props;
  const handlePress = React.useCallback(async () => {
    if (!searching && address) {
      setSearching(true);
      await searchAddress(address);
      setSearching(false);
    }
  }, [searching, address]);
  return (
    <TextField
      {...props}
      right={
       <TextField.Icon
          name={searching ? 'loading' : 'magnify'}
          onPress={handlePress}
          forceTextInputFocus={false}
        />
      }
    />
  );
}

function CoordinatePickerHelperText({ props }: { props: CoordinateProps }) {
  const {
    helperText =
      'Elige la ubicación buscando una dirección y/o presionando en el mapa',
    error,
    errorText,
  } = props;
  return (
    <HelperText
      helperText={helperText}
      error={error}
      errorText={errorText}
      style={styles.coordinatePickerHelperText}
    />
  );
}

const styles = StyleSheet.create({
  coordinatePickerHelperText: {
    height: Layout.isSmallDevice ? 38.5 : undefined, // 38.5px = 2 lines
    marginBottom: 16,
  },
});

export { LatLng as Coordinate };

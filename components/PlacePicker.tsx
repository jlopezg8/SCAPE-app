import * as Location from 'expo-location';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Camera, LatLng, MapEvent, Marker } from 'react-native-maps';

import { TextField, TextFieldProps } from '../components/inputs';
import { HelperText } from '../components/misc';
import '../utils/setExpoLocationGoogleApiKeyOnWeb';

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
    <TheMapView
      theRef={mapRef}
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
    } else {
      // Requires providing an API key by setGoogleApiKey (only on Web):
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

interface TheMapViewProps {
  theRef: React.RefObject<MapView>;
  coordinate: CoordinateProps['coordinate'];
  setCoordinate: CoordinateProps['setCoordinate'];
  foundLocations: LatLng[];
  locationPermissionsGranted?: boolean;
}

function TheMapView(
  {
    theRef,
    coordinate,
    setCoordinate,
    foundLocations,
    locationPermissionsGranted,
  }: TheMapViewProps
) {
  useMoveToInitialCoordinate(coordinate, theRef, locationPermissionsGranted);
  const setCoordinateFromMapEvent = (e: MapEvent) => {
    const { coordinate } = e.nativeEvent;
    setCoordinate(coordinate);
  };
  const [mapReady, setMapReady] = React.useState(false);
  return (
    <MapView
      ref={theRef}
      loadingEnabled // show a loading indicator while the map is loading
      onPress={setCoordinateFromMapEvent}
      onPoiClick={setCoordinateFromMapEvent}
      onMarkerPress={setCoordinateFromMapEvent}
      // Solves "showsMyLocationButton not showing up on Android" issue:
      // https://github.com/react-native-maps/react-native-maps/issues/2010
      style={[styles.map, { margin: mapReady ? 0 : 1 }]}
      onMapReady={() => setMapReady(true)}      
      showsUserLocation // for showsMyLocationButton
    >
      {foundLocations.map((location, index) =>
        <Marker key={index} coordinate={location} pinColor="blue" />
      )}
      {coordinate && <Marker coordinate={coordinate} zIndex={1} />}
    </MapView>
  );
}

function useMoveToInitialCoordinate(
  initialCoordinate: LatLng | undefined,
  mapRef: React.RefObject<MapView>,
  locationPermissionsGranted: boolean = false,
) {
  React.useEffect(() => {
    if (initialCoordinate) {
      mapRef.current?.animateCamera(mapCoordinateToCamera(initialCoordinate));
    } else if (locationPermissionsGranted) {
      Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.Lowest,
      }).then(({ coords }) =>
        mapRef.current?.animateCamera(mapCoordinateToCamera(coords))
      );
    }
  }, [locationPermissionsGranted]);
}

function mapCoordinateToCamera(coordinate: LatLng): Partial<Camera> {
  return {
    center: coordinate,
    zoom: 17, // https://developers.google.com/maps/documentation/javascript/overview#zoom-levels
  };
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
      style={styles.mapHelperText}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    aspectRatio: 4 / 3,    
  },
  mapHelperText: {
    height: 38.5, // 2 lines
    marginBottom: 16,
  },
});

export { LatLng as Coordinate };

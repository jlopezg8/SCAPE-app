import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Camera, LatLng, MapEvent, Marker } from 'react-native-maps';

import {
  CoordinatePickerProps,
  useMapRef,
  useMoveToInitialCoordinate,
} from './base';

export default function CoordinatePicker(
  {
    mapRef,
    coordinate,
    setCoordinate,
    foundLocations = [],
    locationPermissionsGranted,
  }: CoordinatePickerProps
) {
  const ref = useMapRef(mapRef);
  useMoveToInitialCoordinate(
    coordinate, ref, mapCoordinateToCamera, locationPermissionsGranted);
  const setCoordinateFromMapEvent = ({ nativeEvent }: MapEvent) => {
    const { coordinate } = nativeEvent;
    setCoordinate(coordinate);
  };
  const [mapReady, setMapReady] = React.useState(false);
  return (
    <MapView
      ref={ref}
      loadingEnabled // show a loading indicator while the map is loading
      onPress={setCoordinateFromMapEvent}
      onPoiClick={setCoordinateFromMapEvent}
      onMarkerPress={setCoordinateFromMapEvent}
      // Solves "showsMyLocationButton not showing up on Android" issue:
      // https://github.com/react-native-maps/react-native-maps/issues/2010
      style={[styles.mapView, { margin: mapReady ? 0 : 1 }]}
      onMapReady={() => setMapReady(true)}
      showsUserLocation // for showsMyLocationButton
      accessibilityLabel="Selector de coordenada"
    >
      {foundLocations.map((location, index) =>
        <Marker key={index} coordinate={location} pinColor="blue" />
      )}
      {coordinate && <Marker coordinate={coordinate} zIndex={1} />}
    </MapView>
  );
}

function mapCoordinateToCamera(coordinate: LatLng): Partial<Camera> {
  return {
    center: coordinate,
    zoom: 17, // https://developers.google.com/maps/documentation/javascript/overview#zoom-levels
  };
}

const styles = StyleSheet.create({
  mapView: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
});

import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Camera, LatLng, MapEvent } from 'react-native-maps';

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
  const setCoordinateFromMapEvent = (e: MapEvent) => {
    // @ts-expect-error: react-native-web-maps.MapEvent is actually
    // google.maps.PolyMouseEvent:
    const { latLng: { lat, lng } } = e as RealMapEvent;
    setCoordinate({ latitude: lat(), longitude: lng() });
  };
  return (
    <MapView
      ref={ref}
      // required, unlike the native version; we pass an arbitrary region:
      initialRegion={{
        latitude: 15,
        longitude: -2.970703,
        latitudeDelta: 45,
        longitudeDelta: 90,
      }}
      loadingEnabled // show a loading indicator while the map is loading;
                     // currently not supported
      showsUserLocation // for showsMyLocationButton; currently not supported
      onPress={setCoordinateFromMapEvent}
      onPoiClick={setCoordinateFromMapEvent} // currently not supported
      onMarkerPress={setCoordinateFromMapEvent} // currently not supported
      style={styles.map}
    >
      {foundLocations.map((location, index) =>
        // @ts-expect-error: react-native-web-maps exports Marker not on its
        // own, but as a static property of MapView:
        <MapView.Marker key={index} coordinate={location} pinColor="blue" />
      )}
      {coordinate &&
        // @ts-expect-error: Same as above:
        <MapView.Marker coordinate={coordinate} zIndex={1} />
      }
    </MapView>
  );
}

function mapCoordinateToCamera(coordinate: LatLng): Partial<Camera> {
  const { latitude, longitude } = coordinate;
  return {
    // @ts-expect-error: react-native-web-maps.MapView.animateCamera expects
    // center to have keys { lat, lng }, not { latitude, longitude }:
    center: { lat: latitude, lng: longitude },
    zoom: 17, // https://developers.google.com/maps/documentation/javascript/overview#zoom-levels
  };
}

/** `google.maps.PolyMouseEvent` */
interface RealMapEvent {
  latLng: {
    lat: () => number;
    lng: () => number;
  };
  // ...
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    //aspectRatio: 4 / 3, // does not seem to work on Web
    height: 450,
  },
});

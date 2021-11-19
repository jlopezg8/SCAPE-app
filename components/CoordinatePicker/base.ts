import * as Location from 'expo-location';
import React from 'react';
import MapView, { Camera, LatLng } from 'react-native-maps';

export interface CoordinatePickerProps {
  mapRef?: React.RefObject<MapView>;
  coordinate: LatLng | undefined;
  setCoordinate: (coordinate: LatLng) => void;
  foundLocations?: LatLng[];
  locationPermissionsGranted?: boolean;
}

export function useMapRef(mapRef: CoordinatePickerProps['mapRef']) {
  const defaultRef = React.useRef<MapView>(null);
  return mapRef ?? defaultRef;
}

export function useMoveToInitialCoordinate(
  initialCoordinate: LatLng | undefined,
  mapRef: React.RefObject<MapView>,
  mapCoordinateToCamera: (coordinate: LatLng) => Partial<Camera>,
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

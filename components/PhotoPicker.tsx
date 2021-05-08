import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Menu,
  TouchableRipple
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useMenu from '../hooks/useMenu';

abstract class ImagePickerBase {
  setStatus: (status: string) => void;
  setImageURI: (uri: string) => void;
  setBase64Image : (image: string) => void;

  constructor(options: {
    setStatus: ImagePickerBase['setStatus'],
    setImageURI: ImagePickerBase['setImageURI'],
    setBase64Image : ImagePickerBase['setBase64Image'],
  }) {
    this.setStatus = options.setStatus;
    this.setImageURI = options.setImageURI;
    this.setBase64Image = options.setBase64Image;
  }

  async launch() {
    const { granted } = await this.requestPermissions();
    if (!granted) {
      this.setStatus(this.permissionsNotGrantedMessage);
      return;
    }
    const result = await this._launch({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [1, 1],
      /**
       * TODO: medium: find out if lesser values actually reduce file size.
       * On web it doesn't seem to make any difference.
       */
      quality: 1,
      base64: true,
    });
    if (!result.cancelled) {
      /*
       * On web, base64 is not included despite using the base64 option.
       * Instead, uri is set to the base64 image prefixed with
       * 'data:image/jpeg;base64,'.
       * 
       * On Android, base64 is included and uri points to a file.
       */
      this.setImageURI(result.uri);
      this.setBase64Image(
        result.base64 ?? result.uri.replace(/^data:image\/.*?;base64,/, ''));
    }
    // FIXME: maybe: make sure to handle MainActivity destruction on Android
    // See https://docs.expo.io/versions/v41.0.0/sdk/imagepicker/#imagepickergetpendingresultasync
  }

  abstract requestPermissions():
    { granted: boolean; } | PromiseLike<{ granted: boolean; }>;
  abstract permissionsNotGrantedMessage: string;
  abstract _launch: typeof launchCameraAsync | typeof launchImageLibraryAsync;  
}

class PickerFromImageLibrary extends ImagePickerBase {
  requestPermissions = requestMediaLibraryPermissionsAsync;
  permissionsNotGrantedMessage =
    'Para elegir una imagen permite el acceso a la galería';
  _launch = launchImageLibraryAsync;
}

class PickerFromCamera extends ImagePickerBase {
  requestPermissions = requestCameraPermissionsAsync;
  permissionsNotGrantedMessage =
    'Para tomar una foto permite el acceso a la cámara';
  _launch = launchCameraAsync;
}

function useActions(
  setStatus: ImagePickerBase['setStatus'],
  setBase64Image: ImagePickerBase['setBase64Image'],
) {
  const [photoUri, setImageURI] = React.useState<string | null>(null);
  const options = { setStatus, setImageURI, setBase64Image };
  const pickerFromImageLibrary = new PickerFromImageLibrary(options);
  const pickImage = pickerFromImageLibrary.launch.bind(pickerFromImageLibrary);
  const pickerFromCamera = new PickerFromCamera(options);
  const takePhoto = pickerFromCamera.launch.bind(pickerFromCamera);
  const removePhoto = () => { setImageURI(''); setBase64Image(''); };
  return { photoUri, pickImage, takePhoto, removePhoto };
}

type PhotoPickerProps = {
  setStatus: ImagePickerBase['setStatus'];
  setBase64Image: ImagePickerBase['setBase64Image'];
  disabled?: boolean;
};

/**
 * @requires formik.Formik for Formik state and helpers
 * @requires react-native-paper.Provider for the Material Design components
 * expo-image-picker can be mocked
 */
export function PhotoPicker(
  { setStatus, setBase64Image, disabled = false } : PhotoPickerProps
) {
  const { visible: menuVisible, openMenu, closeMenu, closeMenuAfter } =
    useMenu();
  const { photoUri, pickImage: pickPhoto, takePhoto, removePhoto } =
    useActions(setStatus, setBase64Image);
  const avatar = photoUri
    ? <Avatar.Image size={avatarSize} source={{ uri: photoUri }} />
    : <Avatar.Icon size={avatarSize} icon="image-plus" />;
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <Menu
        visible={!disabled && menuVisible}
        onDismiss={closeMenu}
        anchor={
          <TouchableRipple onPress={openMenu}>
            {avatar}
          </TouchableRipple>
        }
        statusBarHeight={insets.top}
        style={styles.menu}
      >
        <Menu.Item
          /* TODO: add icon="camera" */
          onPress={closeMenuAfter(takePhoto)}
          title="Tomar foto"
        />
        <Menu.Item
          onPress={closeMenuAfter(pickPhoto)}
          title="Elegir una foto"
        />
        {photoUri && <Menu.Item
          onPress={closeMenuAfter(removePhoto)}
          title="Remover foto"
        />}
      </Menu>
    </View>
  );
}

const avatarSize = 96;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginBottom: 32,
  },
  menu: {
    marginTop: avatarSize / 2,
    marginLeft: avatarSize / 2,
  },
});

import { manipulateAsync as manipulateImageAsync } from 'expo-image-manipulator';
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

import { HelperText } from './styled';
import useVisible from '../hooks/useVisible';

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

  // TODO: medium: refactor this method
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
      // For optimal results [...] use faces [...] with a min size of 200x200 px
      // https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236
      const { width, height } = result;
      const resizeFactor = Math.sqrt((400 * 400) / (width * height));
      const resizedImage = await manipulateImageAsync(
        result.uri,
        [{ resize: { width: resizeFactor * width, height: resizeFactor * height } }],
        { compress: 0.5, base64: true }
      );
      /*
       * On web, both base64 and uri are set to the base64 image prefixed with
       * 'data:image/jpeg;base64,'.
       * 
       * On Android, base64 is included and uri points to a file.
       */
      this.setImageURI(resizedImage.uri);
      this.setBase64Image(
        (resizedImage.base64 ?? resizedImage.uri)
          .replace(/^data:image\/.*?;base64,/, '')
      );
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
  const [imageURI, setImageURI] = React.useState<string | null>(null);
  const options = { setStatus, setImageURI, setBase64Image };
  const pickerFromImageLibrary = new PickerFromImageLibrary(options);
  const pickImage = pickerFromImageLibrary.launch.bind(pickerFromImageLibrary);
  const pickerFromCamera = new PickerFromCamera(options);
  const takePhoto = pickerFromCamera.launch.bind(pickerFromCamera);
  const removePhoto = () => { setImageURI(''); setBase64Image(''); };
  return { imageURI, pickImage, takePhoto, removePhoto };
}

type PhotoPickerProps = {
  base64Image?: string;
  setBase64Image: ImagePickerBase['setBase64Image'];
  setStatus: ImagePickerBase['setStatus'];
  accessibilityLabel?: string;
};

/**
 * @requires react-native-paper.Provider for the Material Design components
 * @requires react-native-safe-area-context.SafeAreaProvider for safe area insets
 * expo-image-picker can be mocked
 */
export function PhotoPicker({
  base64Image,
  setBase64Image,
  setStatus,
  accessibilityLabel = 'Tomar o elegir foto',
} : PhotoPickerProps) {
  const menu = useVisible();
  const { imageURI, pickImage: pickPhoto, takePhoto, removePhoto } =
    useActions(setStatus, setBase64Image);
  // Not the most elegant way of handling this picker's value, but it'll do for now:
  const uri = base64Image
    ? `data:image\/.*?;base64,${base64Image}`
    : imageURI;
  const avatar = uri
    ? <Avatar.Image size={avatarSize} source={{ uri }} />
    : <Avatar.Icon size={avatarSize} icon="image-plus" />;
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <Menu
        visible={menu.visible}
        onDismiss={menu.close}
        anchor={
          <TouchableRipple
            onPress={menu.open}
            accessibilityLabel={accessibilityLabel}
          >
            {avatar}
          </TouchableRipple>
        }
        statusBarHeight={insets.top}
        style={styles.menu}
      >
        <Menu.Item
          onPress={menu.closeAfter(takePhoto)}
          title="Tomar foto"
        />
        <Menu.Item
          onPress={menu.closeAfter(pickPhoto)}
          title="Elegir una foto"
        />
        {imageURI && <Menu.Item
          onPress={menu.closeAfter(removePhoto)}
          title="Remover foto"
        />}
      </Menu>
    </View>
  );
}

// TODO: medium: make a PhotoPickerWithHelperText?

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

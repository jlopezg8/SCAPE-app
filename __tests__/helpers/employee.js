import { manipulateAsync as manipulateImageAsync } from "expo-image-manipulator";
import {
  launchCameraAsync,
  requestCameraPermissionsAsync,
} from "expo-image-picker";
import { fireEvent } from "../../test-utils";
import { DatePickerModal } from "react-native-paper-dates";
import { act } from "@testing-library/react-native";

export async function fillInEmployee(employee, renderResult) {
  // We sequentially await for each field filling in (vs using Promise.all,
  // which would fill in the form fields concurrently) so it more closely
  // resembles the way an user would fill in the form:
  for (const [key, value] of Object.entries(employee)) {
    if (value) {
      await fillInFunctions[key](value, renderResult);
    }
  }
}

const fillInFunctions = {
  async photo(photoBase64, { getByLabelText, findByText }) {
    // TODO: medium: extract this mocks using https://jestjs.io/docs/manual-mocks
    requestCameraPermissionsAsync.mockReturnValue(
      Promise.resolve({
        granted: true,
      })
    );
    const imageUri = `data:image/jpg;base64,${photoBase64}`;
    launchCameraAsync.mockReturnValue(
      Promise.resolve({
        canceled: false,
        width: 48, // can be any positive number
        height: 48, // can be any positive number
        uri: imageUri,
      })
    );
    manipulateImageAsync.mockReturnValue(
      Promise.resolve({
        uri: imageUri,
        base64: photoBase64,
      })
    );
    fireEvent.press(getByLabelText("Tomar o elegir foto"));
    await act(async () => {
      fireEvent.press(await findByText("Tomar foto"));
    });
  },
  idDoc(idDoc, { getByLabelText }) {
    fireEvent.changeText(getByLabelText("Documento de identidad*"), idDoc);
  },
  firstName(firstName, { getByLabelText }) {
    fireEvent.changeText(getByLabelText("Nombre*"), firstName);
  },
  lastName(lastName, { getByLabelText }) {
    fireEvent.changeText(getByLabelText("Apellido*"), lastName);
  },
  email(email, { getByLabelText }) {
    fireEvent.changeText(getByLabelText("Correo electrónico*"), email);
  },
  async sex(sex, { getByLabelText, findByText }) {
    fireEvent.press(getByLabelText("Sexo"));
    const optionLabel = sex[0].toUpperCase() + sex.slice(1);
    await act(async () => {
      fireEvent.press(await findByText(optionLabel));
    });
  },
  birthDate(birthDate, { UNSAFE_getByType }) {
    // We tried every "safe" query, but DatePickerModal doesn't accept neither
    // testID nor any accessibility props.

    // `getByType` not working on memoized component:
    // https://github.com/callstack/react-native-testing-library/issues/252

    fireEvent(UNSAFE_getByType(DatePickerModal.type), "confirm", {
      date: new Date(birthDate),
    });
  },
  password(password, { getByLabelText }) {
    fireEvent.changeText(getByLabelText("Contraseña*"), password);
  },
};

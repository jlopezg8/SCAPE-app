import { fireEvent } from "../test-utils";

export async function fillInWorkplace(workplace, renderResult) {
  // We sequentially await for each field filling in (vs using Promise.all,
  // which would fill in the form fields concurrently) so it more closely
  // resembles the way an user would fill in the form:
  for (const [key, value] of Object.entries(workplace)) {
    if (value) {
      await fillInFunctions[key](value, renderResult);
    }
  }
}

const fillInFunctions = {
  name(name, { getByLabelText }) {
    fireEvent.changeText(getByLabelText("Nombre*"), name);
  },

  address(address, { getByLabelText }) {
    fireEvent.changeText(getByLabelText("Dirección*"), address);
  },

  description(description, { getByLabelText }) {
    fireEvent.changeText(getByLabelText("Descripción"), description);
  },

  latitude(latitude, { getByLabelText }) {
    fireEvent.changeText(getByLabelText("Latitud*"), latitude);
  },

  longitude(longitude, { getByLabelText }) {
    fireEvent.changeText(getByLabelText("Longitud*"), longitude);
  },
};

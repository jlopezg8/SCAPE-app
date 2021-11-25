import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import React from "react";

import { createWorkplace } from "../../api/workplaces";
import { CreateWorkplaceScreen } from "../../screens";
import { fillInWorkplace } from "../helpers/workplace";
import { fireEvent, render } from "../test-utils";

jest.mock("@react-navigation/stack");
jest.mock("expo-location");
jest.mock("../../api/workplaces");
// https://github.com/react-native-maps/react-native-maps/issues/2918#issuecomment-510795210
// By the way, the second argument of `jest.mock` must be an inline function.
jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require('react-native');

  const MockMapView = React.forwardRef((props, _ref) => <View {...props} />);
  const MockMarker = props => <View {...props} />;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

requestForegroundPermissionsAsync.mockResolvedValue({
  status: "granted",
});

getCurrentPositionAsync.mockResolvedValue({
  coords: {
    latitude: 0,
    longitude: 0,
  },
});

describe("tests for adding a new workplace", () => {
  beforeEach(() => createWorkplace.mockClear());

  it("adds a new workplace correctly", async () => {
    const workplace = {
      name: "Colanta",
      description: "Lechería",
      address: "Calle y carrera",
      location: {
        latitude: 50.0,
        longitude: -70.5,
      },
    };
    createWorkplace.mockResolvedValueOnce();

    // FIXME: never: Warning: An update to PlacePicker inside a test was not wrapped in act(...).
    // total_hours_wasted_trying_to_fix_that = 3
    const renderResult = render(<CreateWorkplaceScreen />);
    await fillInWorkplace(workplace, renderResult);
    fireEvent.press(renderResult.getByText("Guardar"));

    await renderResult.findByText("Sitio de trabajo creado");
    expect(createWorkplace).toHaveBeenCalledWith(workplace);
  });

  it("doesn't add a new workplace without an address", async () => {
    const workplace = {
      name: "Colanta",
      description: "Lechería",
      address: undefined,
      location: {
        latitude: 50.0,
        longitude: -70.5,
      },
    };

    const renderResult = render(<CreateWorkplaceScreen />);
    await fillInWorkplace(workplace, renderResult);
    fireEvent.press(renderResult.getByText("Guardar"));

    await renderResult.findAllByText("*Requerido");
    expect(createWorkplace).toHaveBeenCalledTimes(0);
  });

  it("doesn't add a new workplace without a name", async () => {
    const workplace = {
      name: undefined,
      description: "Lechería",
      address: "Calle y carrera",
      location: {
        latitude: 50.0,
        longitude: -70.5,
      },
    };

    const renderResult = render(<CreateWorkplaceScreen />);
    await fillInWorkplace(workplace, renderResult);
    fireEvent.press(renderResult.getByText("Guardar"));

    await renderResult.findAllByText("*Requerido");
    expect(createWorkplace).toHaveBeenCalledTimes(0);
  });
});

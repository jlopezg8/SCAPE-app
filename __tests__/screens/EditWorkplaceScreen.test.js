import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import React from "react";

import { editWorkplace, getWorkplace } from "../../api/workplaces";
import { EditWorkplaceScreen } from "../../screens";
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

describe("tests for editing a workplace", () => {
  const workplaceId = 12;
  const originalWorkplace = {
    name: "Colanta",
    description: "Lecheria",
    address: "Calle y carrera",
    location: {
      latitude: 50.0,
      longitude: -70.5,
    },
  };
  getWorkplace.mockResolvedValue(originalWorkplace);
  editWorkplace.mockResolvedValue();

  beforeEach(() => editWorkplace.mockClear());

  it("edits a workplace correctly", async () => {
    const newWorkplace = {
      name: "Celema",
      description: "Deliciosa",
      address: "Calle",
      location: {
        latitude: 50.0,
        longitude: -70.5,
      },
    };
    
    const renderResult = render(
      <EditWorkplaceScreen route={{ params: { id: workplaceId } }} />
    );
    await renderResult.findByText("Guardar");
    await fillInWorkplace(newWorkplace, renderResult);
    fireEvent.press(renderResult.getByText("Guardar"));
    await renderResult.findByText("Sitio de trabajo editado");

    expect(editWorkplace).toHaveBeenCalledWith(workplaceId, newWorkplace);
    expect(editWorkplace).toHaveBeenCalledTimes(1);
  });

  // FIXME: mid: there's no way to clear a workplace's location once it has 
  // one, better think of another test
  it.skip("doesn't save a workplace without a location", async () => {    
    const newWorkplace = {
      name: "Celema",
      description: "Deliciosa",
      address: "Calle",
      location: undefined,
    };

    const renderResult = render(
      <EditWorkplaceScreen route={{ params: { id: workplaceId } }} />
    );
    await renderResult.findByText("Guardar");
    await fillInWorkplace(newWorkplace, renderResult);
    fireEvent.press(renderResult.getByText("Guardar"));

    await renderResult.findAllByText("*Requerido");
    expect(
      await renderResult.queryByText("Sitio de trabajo editado")
    ).toBe(null);
    expect(editWorkplace).toHaveBeenCalledTimes(0);
  });
});

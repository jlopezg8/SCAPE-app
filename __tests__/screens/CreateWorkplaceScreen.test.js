import React from "react";

import { createWorkplace } from "../../api/workplaces";
import { CreateWorkplaceScreen } from "../../screens";
import { fillInWorkplace } from "../helpers/workplace";
import { fireEvent, render } from "../test-utils";

jest.mock("@react-navigation/stack");
jest.mock("../../api/workplaces");

describe("tests for adding a new workplace", () => {
  beforeEach(() => jest.resetAllMocks());

  it("adds a new workplace correctly", async () => {
    const workplace = {
      name: "Colanta",
      description: "Lecheria",
      address: "Calle y carrera",
      latitude: "50.0",
      longitude: "-70.5",
    };
    const renderResult = render(<CreateWorkplaceScreen />);
    await fillInWorkplace(workplace, renderResult);

    createWorkplace.mockReturnValue(Promise.resolve("OK"));
    fireEvent.press(renderResult.getByText("Guardar"));

    await renderResult.findByText("Sitio de trabajo creado");
    expect(createWorkplace).toHaveBeenCalledWith(workplace);
  });

  it("doesn't add a new workplace without address", async () => {
    const workplace = {
      name: "Colanta",
      description: "Lecheria",
      latitude: "50.0",
      longitude: "-70.5",
    };
    const renderResult = render(<CreateWorkplaceScreen />);
    await fillInWorkplace(workplace, renderResult);
    fireEvent.press(renderResult.getByText("Guardar"));
    await renderResult.findAllByText("*Requerido");
    expect(createWorkplace).toHaveBeenCalledTimes(0);
  });
  it("doesn't add a new workplace without name", async () => {
    const workplace = {
      description: "Lecheria",
      address: "Calle y carrera",
      latitude: "50.0",
      longitude: "-70.5",
    };
    const renderResult = render(<CreateWorkplaceScreen />);
    await fillInWorkplace(workplace, renderResult);
    fireEvent.press(renderResult.getByText("Guardar"));
    await renderResult.findAllByText("*Requerido");
    expect(createWorkplace).toHaveBeenCalledTimes(0);
  });
});

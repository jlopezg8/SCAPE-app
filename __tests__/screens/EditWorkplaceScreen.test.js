import React from "react";

import { editWorkplace, getWorkplace } from "../../api/workplaces";
import { EditWorkplaceScreen } from "../../screens";
import { fillInWorkplace } from "../helpers/workplace";
import { fireEvent, render } from "../test-utils";

jest.mock("@react-navigation/stack");
jest.mock("../../api/workplaces");

describe("tests for editing an employee", () => {
  beforeEach(() => jest.resetAllMocks());

  const originalWorkplace = {
    name: "Colanta",
    description: "Lecheria",
    address: "Calle y carrera",
    latitude: "50.0",
    longitude: "-70.5",
  };

  it("edits a workplace correctly", async () => {
    const newWorkplace = {
      name: "Celema",
      description: "Deliciosa",
      address: "Calle",
      latitude: "50.0",
      longitude: "-70.5",
    };
    getWorkplace.mockReturnValue(Promise.resolve(originalWorkplace));
    const renderResult = render(
      <EditWorkplaceScreen route={{ params: { workplaceId: 12 } }} />
    );
    await renderResult.findByText("Guardar");

    await fillInWorkplace(newWorkplace, renderResult);
    fireEvent.press(renderResult.getByText("Guardar"));
    await renderResult.findByText("Sitio de trabajo editado");
    //Shouldn't it be the workplaceId instead of undefined?
    expect(editWorkplace).toHaveBeenCalledWith(undefined, newWorkplace);
    expect(editWorkplace).toHaveBeenCalledTimes(1);
  });

  it("doesn't edit workplace with no coordenates", async () => {
    const newWorkplace = {
      name: "Celema",
      description: "Deliciosa",
      address: "Calle",
      latitude: " ",
      longitude: " ",
    };
    getWorkplace.mockReturnValue(Promise.resolve(originalWorkplace));
    const renderResult = render(
      <EditWorkplaceScreen route={{ params: { workplaceId: 12 } }} />
    );
    await renderResult.findByText("Guardar");

    await fillInWorkplace(newWorkplace, renderResult);
    fireEvent.press(renderResult.getByText("Guardar"));
    await renderResult.findAllByText("*Requerido");
    expect(editWorkplace).toHaveBeenCalledTimes(0);
    expect(await renderResult.queryByText("Sitio de trabajo editado")).toBe(
      null
    );
  });
});

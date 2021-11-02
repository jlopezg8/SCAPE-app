import React from "react";

import { getWorkplace } from "../../api/workplaces";
import { WorkplaceNotFoundError } from "../../api/workplaces/common";
import { WorkplaceScreen } from "../../screens";
import { render } from "../test-utils";

jest.mock("@react-navigation/native");
jest.mock("../../api/workplaces");

describe("workplace screen tests", () => {
  beforeEach(() => jest.resetAllMocks());

  it("displays the employees correctly", async () => {
    getWorkplace.mockReturnValue(
      Promise.resolve({
        employees: [
          {
            idDoc: "9999",
            firstName: "Falcao",
            lastName: "García",
          },
        ],
      })
    );
    const workplaceId = 1;
    const { findByText } = render(
      <WorkplaceScreen
        navigation={{ navigate: jest.fn() }}
        route={{ params: { id: workplaceId } }}
      />
    );
    await findByText(/Falcao/);
    expect(getWorkplace).toHaveBeenCalledWith(workplaceId);
  });

  it("displays an empty state when there are no employees", async () => {
    getWorkplace.mockReturnValue(
      Promise.resolve({
        employees: [],
      })
    );
    const workplaceId = 1;
    const { findByText } = render(
      <WorkplaceScreen
        navigation={{ navigate: jest.fn() }}
        route={{ params: { id: workplaceId } }}
      />
    );
    await findByText("No hay empleados");
    expect(getWorkplace).toHaveBeenCalledWith(workplaceId);
  });

  it("displays an error message for a nonexistent workplace", async () => {
    getWorkplace.mockReturnValue(Promise.reject(new WorkplaceNotFoundError()));
    const workplaceId = 1;
    const { findByText } = render(
      <WorkplaceScreen
        navigation={{ navigate: jest.fn() }}
        route={{ params: { id: workplaceId } }}
      />
    );
    await findByText("Sitio de trabajo no encontrado");
    expect(getWorkplace).toHaveBeenCalledWith(workplaceId);
  });

  it("displays workplaces info properly", async () => {
    getWorkplace.mockReturnValue(
      Promise.resolve({
        name: "Colanta",
        address: "Barrio caribe, Medellin",
        latitudePosition: "-70",
        longitudePosition: "50",
        description: "Cooperativa",
        employees: [
          {
            idDoc: "9999",
            firstName: "Falcao",
            lastName: "García",
          },
        ],
      })
    );
    const workplaceId = 1;
    const { findByText } = render(
      <WorkplaceScreen
        navigation={{ navigate: jest.fn() }}
        route={{ params: { id: workplaceId } }}
      />
    );
    await findByText(/Colanta/);
    await findByText(/Barrio caribe/);
    await findByText(/Cooperativa/);
    expect(getWorkplace).toHaveBeenCalledWith(workplaceId);
  });
});

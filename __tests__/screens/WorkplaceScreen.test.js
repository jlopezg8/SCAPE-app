import React from "react";

import { getWorkplace } from "../../api/workplaces";
import { WorkplaceNotFoundError } from "../../api/workplaces/common";
import { WorkplaceScreen } from "../../screens";
import { render } from "../test-utils";

jest.mock("@react-navigation/native");
jest.mock("../../api/workplaces");

describe("workplace screen tests", () => {
  const workplaceId = 1;

  beforeEach(() => getWorkplace.mockClear());

  it("displays the employees correctly", async () => {
    getWorkplace.mockResolvedValueOnce({
      employees: [
        { idDoc: "9999", firstName: "Falcao", lastName: "García" },
      ],
    });

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
    getWorkplace.mockResolvedValueOnce({ employees: [] });

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
    getWorkplace.mockRejectedValueOnce(new WorkplaceNotFoundError());

    const { findByText } = render(
      <WorkplaceScreen
        navigation={{ navigate: jest.fn() }}
        route={{ params: { id: workplaceId } }}
      />
    );

    await findByText("Sitio de trabajo no encontrado");
    expect(getWorkplace).toHaveBeenCalledWith(workplaceId);
  });

  it("displays a workplace info properly", async () => {    
    getWorkplace.mockResolvedValueOnce({
      name: "Colanta",
      description: "Cooperativa",
      address: "Barrio Caribe, Medellín",
      location: {
        latitude: -70,
        longitude: 50,
      },
      employees: [
        { idDoc: "9999", firstName: "Falcao", lastName: "García" },
      ],
    });

    const { findByText } = render(
      <WorkplaceScreen
        navigation={{ navigate: jest.fn() }}
        route={{ params: { id: workplaceId } }}
      />
    );

    await findByText(/Colanta/);
    await findByText(/Cooperativa/);
    await findByText(/Barrio Caribe/);
    expect(getWorkplace).toHaveBeenCalledWith(workplaceId);
  });
});

import { useNavigation } from '@react-navigation/native';
import React from "react";

import { EmployerHomeScreen } from "../../screens";
import { getWorkplaces } from "../../api/workplaces";
import { render } from "../test-utils";

jest.mock("@react-navigation/native");
jest.mock("@react-navigation/stack");
jest.mock("../../api/workplaces");

describe("workplace list tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useNavigation.mockReturnValue({ isFocused: () => true });
  });

  it("displays workplaces correctly", async () => {
    getWorkplaces.mockReturnValue(
      Promise.resolve([{ id: 1, name: "Colanta", address: "La lecheria" }])
    );
    const { findByText } = render(
      <EmployerHomeScreen navigation={{ navigate: jest.fn() }} />
    );
    await findByText(/Colanta/);
    await findByText(/La lecheria/);
    expect(getWorkplaces).toHaveBeenCalled();
  });

  it("displays an empty state when there are no workplaces", async () => {
    getWorkplaces.mockReturnValue(Promise.resolve([]));
    const { findByText } = render(
      <EmployerHomeScreen navigation={{ navigate: jest.fn() }} />
    );
    await findByText(/no hay sitios/i);
    expect(getWorkplaces).toHaveBeenCalled();
  });

  it("displays an error message for failed request", async () => {
    getWorkplaces.mockReturnValue(Promise.reject(new Error()));
    const { findByText } = render(
      <EmployerHomeScreen navigation={{ navigate: jest.fn() }} />
    );
    await findByText(/No se pudieron obtener los sitios de trabajo/);
    expect(getWorkplaces).toHaveBeenCalled();
  });
});

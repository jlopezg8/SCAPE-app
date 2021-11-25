import { useNavigation } from '@react-navigation/native';
import React from "react";

import { getWorkplaces } from "../../api/workplaces";
import { EmployerHomeScreen } from "../../screens";
import { render } from "../test-utils";

jest.mock("@react-navigation/native");
jest.mock("@react-navigation/stack");
jest.mock("../../api/workplaces");

useNavigation.mockReturnValue({ isFocused: () => true });

describe("workplace list tests", () => {
  beforeEach(() => getWorkplaces.mockClear());

  it("displays workplaces correctly", async () => {
    getWorkplaces.mockResolvedValueOnce([
      { id: 1, name: "Colanta", address: "La lechería" },
    ]);
    const { findByText } = render(
      <EmployerHomeScreen navigation={{ navigate: jest.fn() }} />
    );
    await findByText(/Colanta/);
    await findByText(/La lechería/);
    expect(getWorkplaces).toHaveBeenCalled();
  });

  it("displays an empty state when there are no workplaces", async () => {
    getWorkplaces.mockResolvedValueOnce([]);
    const { findByText } = render(
      <EmployerHomeScreen navigation={{ navigate: jest.fn() }} />
    );
    await findByText(/No hay sitios de trabajo/);
    expect(getWorkplaces).toHaveBeenCalled();
  });

  it("displays an error message for failed requests", async () => {
    getWorkplaces.mockRejectedValueOnce(new Error());
    const { findByText } = render(
      <EmployerHomeScreen navigation={{ navigate: jest.fn() }} />
    );
    await findByText(/No se pudieron obtener los sitios de trabajo/);
    expect(getWorkplaces).toHaveBeenCalled();
  });
});

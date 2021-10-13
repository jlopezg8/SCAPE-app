import React from "react";
import WorkplaceScreen from "../../screens/WorkplaceScreen";
import { render } from "../../test-utils";
import getEmployeesByWorkplace from "../../api/employees/getEmployeesByWorkplace";

jest.mock("@react-navigation/native");
jest.mock("../../api/employees/getEmployeesByWorkplace");

describe("Employee list", () => {
  beforeEach(() => jest.resetAllMocks());

  it("Shows employees properly", async () => {
    getEmployeesByWorkplace.mockReturnValue(
      Promise.resolve([
        {
          idDoc: "9999",
          firstName: "Falcao",
          lastName: "Garcia",
          email: "falcaito@gmail.com",
          image: [
            {
              image: undefined,
            },
          ],
        },
      ])
    );
    const { findByText } = render(
      <WorkplaceScreen route={{ params: { id: 1 } }} />
    );
    const employee = await findByText(/Falcao/);
    expect(employee).toBeTruthy();
  });
});

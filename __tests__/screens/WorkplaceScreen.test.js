import React from "react";
import fetch from "isomorphic-fetch";
import { rest } from "msw";
import { setupServer } from "msw/node";
import WorkplaceScreen from "../../screens/WorkplaceScreen";
import { render } from "../../test-utils";

global.fetch = fetch;
const handlers = [
  rest.get(
    "https://scapeapi.azurewebsites.net/api/employee/GetEmployeesByWorkPlace/1",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            idWorkPlace: 1,
            startJobDate: "2021-01-01T00:00:00",
            endJobDate: "2022-01-01T00:00:00",
            schedule: "10-20",
            employee: {
              id: 2,
              documentId: "1053",
              firstName: "Pedro",
              lastName: "Sanchez",
              email: "pedro@gmail.com",
              image: [
                {
                  image: undefined,
                },
              ],
            },
          },
          {
            idWorkPlace: 1,
            startJobDate: "2021-01-01T00:00:00",
            endJobDate: "2021-01-01T00:00:00",
            schedule: "8-18",
            employee: {
              id: 3,
              documentId: "9999",
              firstName: "Radamel Falcao",
              lastName: "Garcia",
              email: "falcaito@gmail.com",
              image: [
                {
                  image: undefined,
                },
              ],
            },
          },
        ])
      );
    }
  ),
];
jest.mock("@react-navigation/native");
const mockServer = setupServer(...handlers);

describe("Employee list", () => {
  beforeAll(() => mockServer.listen());
  afterEach(() => mockServer.resetHandlers());
  afterAll(() => mockServer.close());
  it("Shows employees properly", async () => {
    const { findByText, debug } = render(
      <WorkplaceScreen route={{ params: { id: 1 } }} />
    );
    const employee = await findByText(/Falcao/);
    expect(employee).toBeTruthy();
  });
  it("Shows message when empty list", async () => {
    rest.get(
      "https://scapeapi.azurewebsites.net/api/employee/GetEmployeesByWorkPlace/1",
      (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      }
    );
    const { queryByText } = render(
      <WorkplaceScreen route={{ params: { id: 1 } }} />
    );
    const employee = await queryByText(/Falcao/);
    expect(employee).toBeFalsy();
    const message = await queryByText(/No hay empleados/i);
    expect(message).toBeTruthy();
  });
  it.skip("Redirects on invalid workspace", () => {
    expect.hasAssertions();
  });
});

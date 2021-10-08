import React from "react";
import fetch from "isomorphic-fetch";
import { rest } from "msw";
import { setupServer } from "msw/node";
import WorkplaceScreen from "../../screens/WorkplaceScreen";
import { render } from "../../test-utils";
import getEmployeesByWorkplace from "../../api/employees/getEmployeesByWorkplace";

global.fetch = fetch;

jest.mock("@react-navigation/native");
jest.mock("../../api/employees/getEmployeesByWorkplace");

describe("Employee list", () => {
  beforeEach(() => jest.resetAllMocks());

  it.only("Shows employees properly", async () => {
    getEmployeesByWorkplace.mockReturnValue(
      Promise.resolve([
        {
          id: 3,
          documentId: "9999",
          firstName: "Radamel Carlos",
          lastName: "Garcia",
          email: "falcaito@gmail.com",
          image: [
            {
              image: "/9j/",
            },
          ],
        },
      ])
    );
    const { findByText, debug } = render(
      <WorkplaceScreen route={{ params: { id: 1 } }} />
    );
    const employee = await findByText(/Falcao/);
    expect(getEmployeesByWorkplace).toHaveBeenCalled();
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
    expect(employee).toBeNull();
    //Mensaje de vacio
  });
});
/*




test('renders mock drink data', async () => {
  render(<DrinkSearch />)
  const searchInput = screen.getByRole('searchbox')

  user.type(searchInput, 'vodka, {enter}')

  expect(
    await screen.findByRole('img', { name: /test drink/i })
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: /test drink/i })
  ).toBeInTheDocument()
  expect(screen.getByText(/test ingredient/i)).toBeInTheDocument()
  expect(screen.getByText(/test instructions/i)).toBeInTheDocument()
})

test('renders no drink results', async () => {
  mockServer.use(
    rest.get(
      'https://www.thecocktaildb.com/api/json/v1/1/search.php',
      (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            drinks: null
          })
        )
      }
    )
  )
  render(<DrinkSearch />)
  const searchInput = screen.getByRole('searchbox')

  user.type(searchInput, 'vodka, {enter}')

  expect(
    await screen.findByRole('heading', { name: /no drinks found/i })
  ).toBeInTheDocument()
})

test('renders service unavailable', async () => {
  mockServer.use(
    rest.get(
      'https://www.thecocktaildb.com/api/json/v1/1/search.php',
      (req, res, ctx) => {
        return res(ctx.status(503))
      }
    )
  )
  render(<DrinkSearch />)
  const searchInput = screen.getByRole('searchbox')

  user.type(searchInput, 'vodka, {enter}')

  expect(
    await screen.findByRole('heading', { name: /Service unavailable/i })
  ).toBeInTheDocument()
})

test('prevents GET request when search input empty', async () => {
  render(<DrinkSearch />)
  const searchInput = screen.getByRole('searchbox')

  user.type(searchInput, '{enter}')

  expect(screen.queryByRole('heading')).not.toBeInTheDocument()
})
*/

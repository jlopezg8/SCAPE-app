require("dotenv").config();

import fetch from "isomorphic-fetch";
import { toSatisfyAll } from "jest-extended";

import { login } from "../../api/auth";
import { getWorkplace } from "../../api/workplaces";
import { WorkplaceNotFoundError } from "../../api/workplaces/common";
import { employeeSchema } from "../../models/Employee";

global.fetch = fetch;
expect.extend({ toSatisfyAll });

// TODO: mid: make more assertions about the returned workplace, not just about
// its employees:
describe("tests for fetching the employees of a workplace from the API", () => {
  beforeAll(async () => {
    await login(
      process.env.TEST_EMPLOYER_USERNAME,
      process.env.TEST_EMPLOYER_PASSWORD
    );
  });

  it("returns a list of employees for an existing workplace", async () => {
    const workplaceId = 68;
    const workplace = await getWorkplace(workplaceId);
    const isValidEmployee = (employee) => employeeSchema.isValidSync(employee);
    expect(workplace.employees).toSatisfyAll(isValidEmployee);
  });

  it("returns an empty list for a workplace with no employees", async () => {
    const workplaceId = 7;
    const workplace = await getWorkplace(workplaceId);
    expect(workplace.employees).toEqual([]);
  });

  it("throws an error for a nonexistent workplace", async () => {
    const workplaceId = 11;
    return expect(getWorkplace(workplaceId)).rejects.toThrow(
      WorkplaceNotFoundError
    );
  });
});

import { login, InvalidCredentialsError } from "../../api/auth";
import fetch from "isomorphic-fetch";
describe("API", () => {
  beforeAll(() => {
    global.fetch = fetch;
  });
  it("Returns an error message for invalid credentials", async () => {
    const email = "invalid@credentials.com",
      password = "incorrect horse battery staple";
    await expect(() => login(email, password)).rejects.toThrow(
      InvalidCredentialsError
    );
  });

  //Fetch does not work due to it being called locally instead of the browser
  it("Returns success, role and token with valid credentials", async () => {
    const email = "employee@ontime.com",
      password = "ontime";
    const response = await login(email, password);
    expect(response["role"]).toBe("employee");
    expect(response["accessToken"]).toBeTruthy();
  });
  it("Returns an error message for empty credentials", async () => {
    const email = "",
      password = "";
    await expect(() => login(email, password)).rejects.toThrow();
  });
  it("Returns an error message for null credentials", async () => {
    const email = null,
      password = null;
    await expect(() => login(email, password)).rejects.toThrow();
  });
});

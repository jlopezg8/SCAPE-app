import React from "react";

import { AuthContext, InvalidCredentialsError } from "../../hooks/useAuth";
import LoginScreen from "../../screens/LoginScreen";
import { fireEvent, render } from "../../test-utils";

describe("login screen tests", () => {
  it("displays an error message for invalid credentials", async () => {
    const authValue = {
      login: jest.fn().mockRejectedValue(new InvalidCredentialsError()),
    };
    const { findByText, getByLabelText, getByText } = render(
      <AuthContext.Provider value={authValue}>
        <LoginScreen />
      </AuthContext.Provider>
    );
    const email = "invalid@credentials.com",
      password = "incorrect horse battery staple";
    fireEvent.changeText(getByLabelText("Correo electrónico"), email);
    fireEvent.changeText(getByLabelText("Contraseña"), password);
    fireEvent.press(getByText("Iniciar sesión"));
    await findByText("Usuario o contraseña incorrectos");
    expect(authValue.login).toHaveBeenCalledWith(email, password);
  });
});

/*import user from '@testing-library/user-event'
import DrinkSearch from './DrinkSearch'
import { mockServer } from './mocks/server.js'
beforeAll(() => mockServer.listen())
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())
test('renders mock drink data, async () => {
  render(<DrinkSearch />)
  const searchInput = screen.getByRole('searchbox')
  user.type(searchInput, 'vodka, {enter}')
  expect(
    await screen.findByRole('img', { name: /test drink/i })
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: /test drink/i })
    ).toBeInTheDocument()
  expect(screen.getByText(/test 
    ingredient/i)).toBeInTheDocument()
  expect(screen.getByText(/test 
    instructions/i)).toBeInTheDocument()
})*/

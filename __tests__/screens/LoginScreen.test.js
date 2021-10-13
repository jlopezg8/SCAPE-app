import React from 'react';

import { AuthContext, InvalidCredentialsError } from '../../hooks/useAuth';
import LoginScreen from '../../screens/LoginScreen';
import { fireEvent, render } from '../../test-utils';

describe('login screen tests', () => {
  it('displays an error message for invalid credentials', async () => {
    const authValue = {
      login: jest.fn().mockRejectedValue(new InvalidCredentialsError()),
    };
    const { findByText, getByLabelText, getByText } = render(
      <AuthContext.Provider value={authValue}>
        <LoginScreen />
      </AuthContext.Provider>
    );
    const email = 'invalid@credentials.com',
          password = 'incorrect horse battery staple';
    fireEvent.changeText(getByLabelText('Correo electrónico'), email);
    fireEvent.changeText(getByLabelText('Contraseña'), password);
    fireEvent.press(getByText('Iniciar sesión'));
    await findByText('Usuario o contraseña incorrectos');
    expect(authValue.login).toHaveBeenCalledWith(email, password);
  });
});

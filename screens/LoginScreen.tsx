import { Formik, FormikHelpers } from 'formik';
import React from 'react';

import {
  StatusSnackbar,
  SubmitButton,
  TextField,
} from '../components/formik';
import Logo from '../components/Logo';
import { Surface } from '../components/styled';
import { useAuthContext } from '../hooks/useAuth';
import LoginRequest, {
  loginRequestInitialValues,
  loginRequestSchema,
} from '../models/LoginRequest';

/**
 * @requires react-native-paper.Provider for the Material Design components
 * @requires ../hooks/useAuth.AuthContext.Provider
 * ../hooks/useAuth.useAuthContext.login can be mocked
 */
export default function LoginScreen() {
  const { login } = useAuthContext();
  const submit = async (
    { username, password }: LoginRequest,
    { setStatus }: FormikHelpers<LoginRequest>
  ) => {
    try {
      await login(username, password);
    } catch (err) {
      const error = err as Error;
      setStatus(error.name === 'BadRequestError'
                  ? error.message
                  : 'No se pudo iniciar sesión. Ponte en contacto con Soporte.');
      console.error(error);
    }
  }
  return (
    <Formik
      initialValues={loginRequestInitialValues}
      onSubmit={submit}
      validationSchema={loginRequestSchema}
    >
      <Surface style={{ justifyContent: 'center' }}>
        <Logo style={{ marginBottom: 32 }} />
        <TextField
          label="Correo electrónico"
          name="username"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextField
          label="Contraseña"
          name="password"
          secureTextEntry
        />
        <SubmitButton label="Iniciar sesión" />
        <StatusSnackbar />
      </Surface>
    </Formik>
  );
}

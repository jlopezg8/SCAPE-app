import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  StatusSnackbar,
  SubmitButton,
  TextField as RawTextField,
  TextFieldType,
} from '../components/formik';
import Logo from '../components/Logo';
import { Surface } from '../components/styled';
import { InvalidCredentialsError, useAuthContext } from '../hooks/useAuth';
import LoginRequest, {
  loginRequestInitialValues,
  loginRequestSchema,
} from '../models/LoginRequest';

const TextField: TextFieldType<LoginRequest> = RawTextField;

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
      if (error instanceof InvalidCredentialsError) {
        setStatus('Usuario o contraseña incorrectos');
      } else {
        setStatus('No se pudo iniciar sesión. Ponte en contacto con Soporte.');
        console.error(error);
      }
    }
  }
  return (
    <Formik
      initialValues={loginRequestInitialValues}
      onSubmit={submit}
      validationSchema={loginRequestSchema}
    >
      <Surface style={styles.surface}>
        <View style={styles.container}>
          <Logo style={styles.logo} />
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
        </View>
        <StatusSnackbar />
      </Surface>
    </Formik>
  );
}

const styles = StyleSheet.create({
  surface: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 425,
  },
  logo: {
    marginBottom: 32,
  },
});

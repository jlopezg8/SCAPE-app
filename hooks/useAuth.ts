import React from 'react';

import { login, logout } from '../api/auth';
// TODO: low: shouldn't need to specify `/index`, maybe need to change a setting?
import { setAccessToken } from '../api/utils/index';
import Role, { roleSchema } from '../models/Role';
import * as Storage from './utils/storage';

export function useAuthInit() {
  const [state, dispatch] = React.useReducer(authReducer, authInitialState);
  React.useEffect(() => { fetchStoredAuthState(dispatch); }, []);
  return createAuthValue(state, dispatch);
}

export const AuthContext = React.createContext<AuthValue>(undefined!);

export function useAuthContext() {
  return React.useContext(AuthContext);
}

interface AuthState {
  role?: Role;
  accessToken?: string;
  isLoading: boolean;
  isLogout: boolean;
}

interface AuthAction {
  type: 'RESTORE_STATE' | 'LOGIN' | 'LOGOUT';
  role?: Role;
  accessToken?: string;
}

function authReducer(prevState: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_STATE':
      return {
        ...prevState,
        role: action.role,
        accessToken: action.accessToken,
        isLoading: false,
      };
    case 'LOGIN':
      return {
        ...prevState,
        role: action.role,
        accessToken: action.accessToken,
        isLogout: false,
      };
    case 'LOGOUT':
      return {
        ...prevState,
        role: undefined,
        accessToken: undefined,
        isLogout: true,
      };
  }
}

const authInitialState: AuthState = {
  role: undefined,
  accessToken: undefined,
  isLoading: true,
  isLogout: false,
};

const ROLE_KEY = 'role';
const ACCESS_TOKEN_KEY = 'access_token';

async function fetchStoredAuthState(dispatch: React.Dispatch<AuthAction>) {
  const role = await Storage.getItemAsync(ROLE_KEY) || undefined;
  const accessToken =
    await Storage.getItemAsync(ACCESS_TOKEN_KEY) || undefined;
  setAccessToken(accessToken); // TODO: mid: this shouldn't be here
  dispatch({ type: 'RESTORE_STATE', role: roleSchema.cast(role), accessToken });
};

interface AuthValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

function createAuthValue(
  state: AuthState, dispatch: React.Dispatch<AuthAction>
) : AuthValue {
  return {
    ...state,
    login: async (username: string, password: string) => {
      const { role, accessToken } = await login(username, password);
      await Promise.all([
        Storage.setItemAsync(ROLE_KEY, role),
        Storage.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      ]);
      dispatch({ type: 'LOGIN', role, accessToken });
    },
    logout: async () => {
      await Promise.all([
        logout(),
        Storage.deleteItemAsync(ROLE_KEY),
        Storage.deleteItemAsync(ACCESS_TOKEN_KEY),
      ]);
      dispatch({ type: 'LOGOUT' });
    },
  };
}

export { InvalidCredentialsError } from '../api/auth';

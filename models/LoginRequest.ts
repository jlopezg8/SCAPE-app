import * as yup from './utils/localeYup';

export default interface LoginRequest {
  username: string;
  password: string;
}

export const loginRequestInitialValues: LoginRequest = {
  username: '',
  password: '',
};

export const loginRequestSchema: yup.SchemaOf<LoginRequest> = yup.object({
  username: yup.string().email().required(),
  password: yup.string().required(),
});

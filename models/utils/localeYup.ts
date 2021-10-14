import { BaseSchema, setLocale, ValidationError } from 'yup';

setLocale({
  mixed: {
    oneOf: 'Debe ser uno de los siguientes: ${values}',
    required: '*Requerido',
  },
  string: {
    email: 'Correo inválido',
    min: 'Debe tener al menos ${min} caracteres',
    url: 'URL inválida',
  },
  // Neither of these work:
  //date: 'Fecha inválida',
  //date: { typeError: 'Fecha inválida' },
});

export * from 'yup';

export function createValidator(schema: BaseSchema) {
  return function validate(value: any) {
    try {
      schema.validateSync(value);
    } catch (error) {
      if (error instanceof ValidationError) {
        return error.errors.join();
      } else {
        throw error;
      }
    }
    return undefined;
  }
}

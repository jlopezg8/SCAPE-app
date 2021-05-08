import { setLocale } from 'yup';

setLocale({
  mixed: {
    oneOf: 'Debe ser uno de los siguientes: ${values}',
    required: '*Requerido',
  },
  string: { email: 'Correo inválido' },
  // Neither of these work:
  //date: 'Fecha inválida',
  //date: { typeError: 'Fecha inválida' },
});

export * from 'yup';

import * as yup from './utils/localeYup';

export default interface Coordinate {
  latitude: number;
  longitude: number;
}

export const coordinateSchema: yup.SchemaOf<Coordinate> = yup.object({
  latitude: yup.number().required().min(-90).max(90),
  longitude: yup.number().required().min(-180).max(180),
});

import Coordinate, { coordinateSchema } from './Coordinate';
import { Employee } from "./Employee";
import * as yup from './utils/localeYup';

export default interface Workplace {
  id?: number;
  name: string;
  description?: string;
  address: string;
  location?: Coordinate;
  employees?: Employee[];
}

// TODO: mid: make `Workplace` extend this, after making `latitude` and
// `longitude` required (or make this pick | omit properties from `Workplace`):
export interface WorkplaceToCreateOrEdit {
  name: string;
  description?: string;
  address: string;
  location: Coordinate;
}

const _workplaceToCreateInitialValues: {
  [field in keyof Required<WorkplaceToCreateOrEdit>]: undefined
} = {
  name: undefined,
  description: undefined,
  address: undefined,
  location: undefined,
};
export const workplaceToCreateInitialValues =
  _workplaceToCreateInitialValues as unknown as WorkplaceToCreateOrEdit;

export const workplaceToCreateOrEditSchema
  : yup.SchemaOf<WorkplaceToCreateOrEdit>
  = yup.object({
      name: yup.string().required(),
      description: yup.string(),
      address: yup.string().required(),
      location: coordinateSchema,
    });

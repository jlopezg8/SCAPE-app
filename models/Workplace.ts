import { Employee } from "./Employee";
import * as yup from './utils/localeYup';

export default interface Workplace {
  id?: number;
  name: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  employees?: Employee[];
}

// TODO: mid: make `Workplace` extend this, after making `latitude` and
// `longitude` required (or make this pick | omit properties from `Workplace`):
export interface WorkplaceToCreateOrEdit {
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
}

const _workplaceToCreateInitialValues: {
  [field in keyof Required<WorkplaceToCreateOrEdit>]: undefined
} = {
  name: undefined,
  description: undefined,
  address: undefined,
  latitude: undefined,
  longitude: undefined,
};
export const workplaceToCreateInitialValues =
  _workplaceToCreateInitialValues as unknown as WorkplaceToCreateOrEdit;

export const workplaceToCreateOrEditSchema
  : yup.SchemaOf<WorkplaceToCreateOrEdit>
  = yup.object({
      name: yup.string().required(),
      description: yup.string(),
      address: yup.string().required(),
      latitude: yup.number().required(),
      longitude: yup.number().required(),
    });

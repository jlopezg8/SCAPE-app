import { Employee } from "./Employee";

export default interface Workplace {
  id?: number;
  name: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  employees?: Employee[];
}

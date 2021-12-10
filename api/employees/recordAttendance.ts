import { Employee, WorkplaceId } from '../../models';
import { createEndpointGetter } from '../serverURL';
import { post } from '../utils';

export function clockIn(
  employeeIdDoc: Employee['idDoc'], workplaceId: WorkplaceId, timestamp?: Date
) {
  return recordAttendance(
    { employeeIdDoc, workplaceId, type: 'clock-in', timestamp });
}

export function clockOut(
  employeeIdDoc: Employee['idDoc'], workplaceId: WorkplaceId, timestamp?: Date
) {
  return recordAttendance(
    { employeeIdDoc, workplaceId, type: 'clock-out', timestamp });
}

interface RecordAttendanceParams {
  employeeIdDoc: Employee['idDoc'];
  workplaceId: WorkplaceId;
  type: 'clock-in' | 'clock-out';
  timestamp?: Date;
}

async function recordAttendance(
  { employeeIdDoc, workplaceId, type, timestamp = new Date() }
    : RecordAttendanceParams
) {
  const endpoint = createEndpointGetter('api/attendance/')();
  const body: AddAttendanceParams = {
    documentEmployee: employeeIdDoc,
    workPlaceId: workplaceId,
    type: type === 'clock-in' ? 'I' : 'O',
    dateTime: timestamp.toISOString(),
  };
  return await (await post(endpoint, body)).text();
}

interface AddAttendanceParams {
  documentEmployee: string;
  workPlaceId: number;
  type: 'I' | 'O';
  dateTime: string;
}

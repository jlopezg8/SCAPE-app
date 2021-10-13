import { createEndpointGetter } from '../serverURL';
import { post, translateBadRequestErrorMessage as t } from '../utils';

export function clockIn(employeeDocId: string, timestamp?: Date) {
  return recordAttendance({ employeeDocId, type: 'clock-in', timestamp });
}

export function clockOut(employeeDocId: string, timestamp?: Date) {
  return recordAttendance({ employeeDocId, type: 'clock-out', timestamp });
}

interface RecordAttendanceParams {
  employeeDocId: string;
  type: 'clock-in' | 'clock-out';
  timestamp?: Date;
}

async function recordAttendance(
  { employeeDocId, type, timestamp = new Date() }: RecordAttendanceParams
) {
  const endpoint = createEndpointGetter('api/attendance/')();
  const body: AddAttendanceParams = {
    documentEmployee: employeeDocId,
    type: type === 'clock-in' ? 'I' : 'O',
    dateTime: timestamp.toISOString(),
  };
  return await (await post(endpoint, body)).text();
}

interface AddAttendanceParams {
  documentEmployee: string;
  type: 'I' | 'O';
  dateTime: string;
}

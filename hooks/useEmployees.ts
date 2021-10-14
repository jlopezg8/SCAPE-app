import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  clockIn,
  clockOut,
  createEmployee,
  getEmployeeByPhoto,
  getEmployeesByWorkplace,
} from '../api/employees';
import { EmployeeToCreate } from '../models/Employee';

const employeesQueryKey = 'employees';

function useAttendanceRecorder(
  type: 'clock-in' | 'clock-out', employeeDocId: string
) {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    type === 'clock-in' ? clockIn : clockOut,
    {
      onSuccess: () => queryClient.invalidateQueries([
        employeesQueryKey, employeeDocId, 'attendance'
      ]),
    }
  );
  return () => mutation.mutateAsync(employeeDocId);
}

export function useClockIn(employeeDocId: string) {
  return useAttendanceRecorder('clock-in', employeeDocId);
}

export function useClockOut(employeeDocId: string) {
  return useAttendanceRecorder('clock-out', employeeDocId);
}

export function useEmployeeCreator(workplaceId: number) {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (employee: EmployeeToCreate) => createEmployee(employee, workplaceId),
    { onSuccess: () => queryClient.invalidateQueries(employeesQueryKey) }
  );
  return (employee: EmployeeToCreate) => mutation.mutateAsync(employee);
}

export function useEmployeeGetterByPhoto(photo?: string) {
  return useQuery(
    [employeesQueryKey, { photo }],
    () => getEmployeeByPhoto(photo!),
    { enabled: Boolean(photo), retry: false, refetchOnWindowFocus: false }
  );
}

export function useEmployeesGetterByWorkplace(workplaceId: number) {
  return useQuery(
    [employeesQueryKey, { workplaceId }],
    () => getEmployeesByWorkplace(workplaceId),
    { retry: false, refetchOnWindowFocus: false }
  );
}

export {
  WorkplaceNotFoundError
} from '../api/employees/getEmployeesByWorkplace';

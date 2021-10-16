import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  clockIn,
  clockOut,
  createEmployee,
  editEmployee,
  getEmployeeByIdDoc,
  getEmployeeByPhoto,
  getEmployeesByWorkplace,
} from '../api/employees';
import { EmployeeToCreate, EmployeeToEdit } from '../models/Employee';

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

export function useEmployeeEditor(initialIdDoc: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (employee: EmployeeToEdit) => editEmployee(initialIdDoc, employee),
    { onSuccess: () => queryClient.invalidateQueries(employeesQueryKey) }
  );
  return (employee: EmployeeToEdit) => mutation.mutateAsync(employee);
}

export function useEmployeeGetterByIdDoc(idDoc: string) {
  return useQuery(
    [employeesQueryKey, { idDoc }],
    () => getEmployeeByIdDoc(idDoc),
    { retry: false, refetchOnWindowFocus: false }
  );
}

export { EmployeeNotFoundError } from '../api/employees/getEmployeeByIdDoc';

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

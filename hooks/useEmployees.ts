import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  clockIn,
  clockOut,
  createEmployee,
  deleteEmployeeByIdDoc,
  editEmployee,
  getEmployeeByIdDoc,
  getEmployeeByPhoto,
} from '../api/employees';
import {
  Employee,
  EmployeeToCreate,
  EmployeeToEdit,
} from '../models/Employee';
import { WORKPLACES_QUERY_KEY } from './useWorkplaces';

const EMPLOYEES_QUERY_KEY = 'employees';

export function useClockIn(employeeDocId: string) {
  return useAttendanceRecorder('clock-in', employeeDocId);
}

export function useClockOut(employeeDocId: string) {
  return useAttendanceRecorder('clock-out', employeeDocId);
}

// TODO: mid: return `mutation` instead
function useAttendanceRecorder(
  type: 'clock-in' | 'clock-out', employeeDocId: string
) {
  const mutation = useMutation(type === 'clock-in' ? clockIn : clockOut);
  return () => mutation.mutateAsync(employeeDocId);
}

// TODO: mid: return `mutation` instead
export function useEmployeeCreator(workplaceId: number) {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (employee: EmployeeToCreate) => createEmployee(employee, workplaceId),
    {
      onSuccess: (_data, employee) => Promise.all([
        queryClient.invalidateQueries([WORKPLACES_QUERY_KEY, workplaceId]),
        queryClient.invalidateQueries([EMPLOYEES_QUERY_KEY, employee.idDoc]),
        queryClient.invalidateQueries([EMPLOYEES_QUERY_KEY, 'byPhoto']),
      ]),
    }
  );
  return (employee: EmployeeToCreate) => mutation.mutateAsync(employee);
}

export {
  EmployeeWithEmailAlreadyExistsError,
  EmployeeWithIdDocAlreadyExistsError,
} from '../api/employees/createEmployee';
export {
  MultipleFacesInPhotoError,
  PhotoOfAnotherEmployeeError,
} from '../api/employees/addEmployeePhoto';

export function useEmployeeDeleterByIdDoc() {
  const queryClient = useQueryClient();
  return useMutation(deleteEmployeeByIdDoc, {
    onSuccess: (_data, idDoc) => Promise.all([
      queryClient.invalidateQueries(WORKPLACES_QUERY_KEY),
      queryClient.invalidateQueries([EMPLOYEES_QUERY_KEY, idDoc]),
      queryClient.invalidateQueries([EMPLOYEES_QUERY_KEY, 'byPhoto']),
    ]),
  });
}

export function useEmployeeEditor(oldEmployee: Employee) {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (newEmployee: EmployeeToEdit) => editEmployee(oldEmployee, newEmployee),
    {
      onSuccess: (_data, newEmployee) => Promise.all([
        queryClient.invalidateQueries(WORKPLACES_QUERY_KEY),
        queryClient.invalidateQueries([EMPLOYEES_QUERY_KEY, oldEmployee.idDoc]),
        queryClient.invalidateQueries([EMPLOYEES_QUERY_KEY, newEmployee.idDoc]),
        queryClient.invalidateQueries([EMPLOYEES_QUERY_KEY, 'byPhoto']),
      ]),
    }
  );
  return (employee: EmployeeToEdit) => mutation.mutateAsync(employee);
}

export function useEmployeeGetterByIdDoc(idDoc: string) {
  return useQuery(
    [EMPLOYEES_QUERY_KEY, idDoc],
    () => getEmployeeByIdDoc(idDoc)
  );
}

export function useEmployeeGetterByPhoto(photo?: string) {
  return useQuery(
    [EMPLOYEES_QUERY_KEY, 'byPhoto', photo],
    () => getEmployeeByPhoto(photo!),
    { enabled: Boolean(photo) }
  );
}

export { EmployeeNotFoundError } from '../api/employees/common';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  clockIn,
  clockOut,
  createEmployee,
  deleteEmployeeByIdDoc,
  editEmployee,
  getEmployeeByIdDoc,
  getEmployeeByPhoto,
  getEmployeeEmploymentInWorkplace,
  putEmployeeEmploymentInWorkplace,
  removeEmployeeFromWorkplace,
} from '../api/employees';
import {
  Employee,
  EmployeeToCreate,
  EmployeeToEdit,
  WorkplaceId,
} from '../models';
import { WORKPLACES_QUERY_KEY } from './useWorkplaces';

const EMPLOYEES_QUERY_KEY = 'employees';

export function useClockIn(employeeDocId: string, workplaceId: WorkplaceId) {
  return useAttendanceRecorder('clock-in', employeeDocId, workplaceId);
}

export function useClockOut(employeeDocId: string, workplaceId: WorkplaceId) {
  return useAttendanceRecorder('clock-out', employeeDocId, workplaceId);
}

// TODO: mid: return `mutation` instead
function useAttendanceRecorder(
  type: 'clock-in' | 'clock-out',
  employeeDocId: string,
  workplaceId: WorkplaceId
) {
  const mutation = useMutation(type === 'clock-in'
    ? (employeeDocId: string) => clockIn(employeeDocId, workplaceId)
    : (employeeDocId: string) => clockOut(employeeDocId, workplaceId)
  );
  return () => mutation.mutateAsync(employeeDocId);
}

export function useEmployeeCreator(workplaceId: number) {
  const queryClient = useQueryClient();
  return useMutation(
    (employee: EmployeeToCreate) => createEmployee(employee, workplaceId),
    {
      onSuccess: (_data, employee) => Promise.all([
        queryClient.invalidateQueries([WORKPLACES_QUERY_KEY, workplaceId]),
        queryClient.invalidateQueries([EMPLOYEES_QUERY_KEY, employee.idDoc]),
        queryClient.invalidateQueries([EMPLOYEES_QUERY_KEY, 'byPhoto']),
      ]),
    }
  );
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
  return useMutation(
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
}

export function useEmployeeEmploymentInWorkplaceEditor() {
  const queryClient = useQueryClient();
  return useMutation(
    putEmployeeEmploymentInWorkplace,
    {
      onSuccess: (_data, { employeeIdDoc, workplaceId }) => Promise.all([
        queryClient.invalidateQueries([WORKPLACES_QUERY_KEY, workplaceId]),
        queryClient.invalidateQueries(
          getEmployeeEmploymentInWorkplaceQueryKey(employeeIdDoc, workplaceId)
        ),
      ]),
    }
  );
}

const getEmployeeEmploymentInWorkplaceQueryKey = (
  employeeIdDoc: Employee['idDoc'], workplaceId: WorkplaceId
) => ([
  EMPLOYEES_QUERY_KEY,
  employeeIdDoc,
  'employmentInWorkplace',
  workplaceId,
] as const);

export function useEmployeeEmploymentInWorkplaceGetter(
  employeeIdDoc: Employee['idDoc'], workplaceId: WorkplaceId
) {
  return useQuery(
    getEmployeeEmploymentInWorkplaceQueryKey(employeeIdDoc, workplaceId),
    () => getEmployeeEmploymentInWorkplace(employeeIdDoc, workplaceId)
  );
}

export function useEmployeeGetterByIdDoc(idDoc?: string) {
  return useQuery(
    [EMPLOYEES_QUERY_KEY, idDoc],
    () => getEmployeeByIdDoc(idDoc!),
    { enabled: Boolean(idDoc) }
  );
}

export function useEmployeeGetterByPhoto(photo?: string) {
  return useQuery(
    [EMPLOYEES_QUERY_KEY, 'byPhoto', photo],
    () => getEmployeeByPhoto(photo!),
    { enabled: Boolean(photo) }
  );
}

export function useEmployeeRemoverFromWorkplace(workplaceId: WorkplaceId) {
  const queryClient = useQueryClient();
  return useMutation(
    (employeeIdDoc: Employee['idDoc']) =>
      removeEmployeeFromWorkplace(employeeIdDoc, workplaceId),
    {
      onSuccess: (_data, employeeIdDoc) => Promise.all([
        queryClient.invalidateQueries([WORKPLACES_QUERY_KEY, workplaceId]),
        queryClient.invalidateQueries(
          getEmployeeEmploymentInWorkplaceQueryKey(employeeIdDoc, workplaceId)
        ),
      ]),
    }
  );
}

export { EmployeeNotFoundError } from '../api/employees/common';

import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  getEmployeeByPhoto,
  //getEmployees, 
  createEmployee,
} from '../api/employees';
import { Employee } from '../models/Employee';

const employeesQueryKey = 'employees';

export function useEmployeeCreator() {
  const queryClient = useQueryClient();
  const mutation = useMutation(createEmployee, {
    onSuccess: () => queryClient.invalidateQueries(employeesQueryKey),
  });
  return useCallback(
    (employee: Employee) => mutation.mutateAsync(employee), [mutation]);
}

export function useAttendanceRegister(photo?: string) {
  return useQuery(
    [employeesQueryKey, photo],
    () => getEmployeeByPhoto(photo),
    { enabled: Boolean(photo), retry: false }
  );
}

export function useEmployeeGetter() {
  //const query = useQuery(employeesQueryKey, getEmployees);
  //return query;
}

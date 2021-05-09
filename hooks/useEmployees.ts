import { useMutation, useQuery, useQueryClient } from 'react-query';

import './utils/ignoreReactQueryLongTimerWarning';
import { createEmployee, getEmployeeByPhoto } from '../api/employees';
import { Employee } from '../models/Employee';

const employeesQueryKey = 'employees';

export function useAttendanceRegister(photo?: string) {
  return useQuery(
    [employeesQueryKey, { photo }],
    () => getEmployeeByPhoto(photo!),
    { enabled: Boolean(photo), retry: false, refetchOnWindowFocus: false }
  );
}

export function useEmployeeCreator() {
  const queryClient = useQueryClient();
  const mutation = useMutation(createEmployee, {
    onSuccess: () => queryClient.invalidateQueries(employeesQueryKey),
  });
  return (employee: Employee) => mutation.mutateAsync(employee);
}

import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  createWorkplace,
  getWorkplace,
  getWorkplaces,
} from '../api/workplaces';

export const WORKPLACES_QUERY_KEY = 'workplaces';

export function useWorkplaceCreator() {
  const queryClient = useQueryClient();
  return useMutation(createWorkplace, {
    onSuccess: () => queryClient.invalidateQueries(WORKPLACES_QUERY_KEY),
  });
}

export function useWorkplaceGetter(id: number) {
  return useQuery([WORKPLACES_QUERY_KEY, id], () => getWorkplace(id));
}

export function useWorkplacesGetter() {
  return useQuery(WORKPLACES_QUERY_KEY, getWorkplaces);
}

export { WorkplaceNotFoundError } from '../api/workplaces/common';

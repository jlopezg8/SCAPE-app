import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  createWorkplace,
  deleteWorkplace,
  editWorkplace,
  getWorkplace,
  getWorkplaces,
  getWorkplacesNearLocation,
} from '../api/workplaces';
import { WorkplaceToCreateOrEdit } from '../models/Workplace';

export const WORKPLACES_QUERY_KEY = 'workplaces';

export function useWorkplaceCreator() {
  const queryClient = useQueryClient();
  return useMutation(createWorkplace, {
    onSuccess: () => queryClient.invalidateQueries(WORKPLACES_QUERY_KEY),
  });
}

export function useWorkplaceDeleter() {
  const queryClient = useQueryClient();
  return useMutation(deleteWorkplace, {
    onSuccess: (_data, workplaceId) => Promise.all([
      queryClient.invalidateQueries(WORKPLACES_QUERY_KEY, { exact: true }),
      queryClient.invalidateQueries([WORKPLACES_QUERY_KEY, workplaceId]),
    ]),
  });
}

export function useWorkplaceEditor(workplaceId: number) {
  const queryClient = useQueryClient();
  return useMutation(
    (newWorkplace: WorkplaceToCreateOrEdit) =>
      editWorkplace(workplaceId, newWorkplace),
    {
      onSuccess: () => Promise.all([
        queryClient.invalidateQueries(WORKPLACES_QUERY_KEY, { exact: true }),
        queryClient.invalidateQueries([WORKPLACES_QUERY_KEY, workplaceId]),
      ]),
    }
  );
}

export function useWorkplaceGetter(workplaceId: number) {
  return useQuery(
    [WORKPLACES_QUERY_KEY, workplaceId],
    () => getWorkplace(workplaceId)
  );
}

export function useWorkplacesGetter() {
  return useQuery(WORKPLACES_QUERY_KEY, getWorkplaces);
}

export function useWorkplacesNearLocationGetter() {
  return useQuery(WORKPLACES_QUERY_KEY, getWorkplacesNearLocation);
}

export { WorkplaceNotFoundError } from '../api/workplaces/common';

import { useQuery } from 'react-query';

import { getWorkplace, getWorkplaces } from '../api/workplaces';

export const WORKPLACES_QUERY_KEY = 'workplaces';

export function useWorkplaceGetter(id: number) {
  return useQuery([WORKPLACES_QUERY_KEY, id], () => getWorkplace(id));
}

export function useWorkplacesGetter() {
  return useQuery(WORKPLACES_QUERY_KEY, getWorkplaces);
}

export { WorkplaceNotFoundError } from '../api/workplaces/common';

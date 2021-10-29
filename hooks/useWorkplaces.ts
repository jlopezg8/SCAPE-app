import { useQuery } from 'react-query';

import { getWorkplace } from '../api/workplaces';

export const WORKPLACES_QUERY_KEY = 'workplaces';

export function useWorkplaceGetter(id: number) {
  return useQuery([WORKPLACES_QUERY_KEY, id], () => getWorkplace(id));
}

export { WorkplaceNotFoundError } from '../api/workplaces/common';

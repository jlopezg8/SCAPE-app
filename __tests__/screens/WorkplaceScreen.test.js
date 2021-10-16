import React from 'react';

import { getEmployeesByWorkplace } from '../../api/employees';
import {
  WorkplaceNotFoundError,
} from '../../api/employees/getEmployeesByWorkplace';
import { WorkplaceScreen } from '../../screens';
import { render } from '../../test-utils';

jest.mock('@react-navigation/native');
jest.mock('../../api/employees');

describe('workplace screen tests', () => {
  beforeEach(() => jest.resetAllMocks());

  it('displays the employees correctly', async () => {
    getEmployeesByWorkplace.mockReturnValue(
      Promise.resolve([
        {
          idDoc: '9999',
          firstName: 'Falcao',
          lastName: 'García',
        },
      ])
    );
    const workplaceId = 1;
    const { findByText } = render(
      <WorkplaceScreen
        navigation={{ navigate: jest.fn() }}
        route={{ params: { id: workplaceId } }}
      />
    );
    await findByText(/Falcao/);
    expect(getEmployeesByWorkplace).toHaveBeenCalledWith(workplaceId);
  });

  it('displays an empty state when there are no employees', async () => {
    getEmployeesByWorkplace.mockReturnValue(Promise.resolve([]));
    const workplaceId = 1;
    const { findByText } = render(
      <WorkplaceScreen
        navigation={{ navigate: jest.fn() }}
        route={{ params: { id: workplaceId } }}
      />
    );
    await findByText('No hay empleados');
    expect(getEmployeesByWorkplace).toHaveBeenCalledWith(workplaceId);
  });

  it('displays an error message for a nonexistent workplace', async () => {
    getEmployeesByWorkplace.mockReturnValue(
      Promise.reject(new WorkplaceNotFoundError())
    );
    const workplaceId = 1;
    const { findByText } = render(
      <WorkplaceScreen
        navigation={{ navigate: jest.fn() }}
        route={{ params: { id: workplaceId } }}
      />
    );
    await findByText('Este sitio de trabajo no fue encontrado');
    expect(getEmployeesByWorkplace).toHaveBeenCalledWith(workplaceId);
  });
});

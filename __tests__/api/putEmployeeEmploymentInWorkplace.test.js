require('dotenv').config();

import fetch from 'isomorphic-fetch';
import { ValidationError } from 'yup';

import { login } from '../../api/auth';
import { putEmployeeEmploymentInWorkplace } from '../../api/employees';
import { EmployeeNotFoundError } from '../../api/employees/common';
import { WorkplaceNotFoundError } from '../../api/workplaces/common';

global.fetch = fetch;

describe('putEmployeeEmploymentInWorkplace tests', () => {
  beforeAll(async () => {
    await login(
      process.env.TEST_EMPLOYER_USERNAME,
      process.env.TEST_EMPLOYER_PASSWORD
    );
  });

  const getEmployment = () => ({
    employeeIdDoc: '9999',
    workplaceId: 68,
    schedules: [
      {
        dayOfWeek: 1,
        startTime: { hours: 0, minutes: 0 },
        endTime:  { hours: 0, minutes: 1 },
      },
      {
        dayOfWeek: 1,
        startTime: { hours: 0, minutes: 1 },
        endTime:  { hours: 0, minutes: 2 },
      },
    ],
    startDate: new Date(),
    endDate: new Date(),
  });

  const expectNotToThrowWith = employment =>
    expect(putEmployeeEmploymentInWorkplace(employment))
      .resolves
      .not.toThrow();
  
  const expectToThrowWith = (employment, errorType) =>
    expect(putEmployeeEmploymentInWorkplace(employment))
      .rejects
      .toThrow(errorType);

  it('putEmployeeEmploymentInWorkplace successfully', () => {
    const employment = getEmployment();
    return expectNotToThrowWith(employment);
  });

  it('throws an error for a missing employeeIdDoc', () => {
    const employment = getEmployment();
    delete employment.employeeIdDoc;
    return expectToThrowWith(employment, ValidationError);
  });

  it('throws an error for a nonexistent employee', () => {
    const employment = getEmployment();
    employment.employeeIdDoc = '1';
    return expectToThrowWith(employment, EmployeeNotFoundError);
  });

  it('throws an error for a missing workplaceId', () => {
    const employment = getEmployment();
    delete employment.workplaceId;
    return expectToThrowWith(employment, ValidationError);
  });

  it('throws an error for a nonexistent workplace', () => {
    const employment = getEmployment();
    employment.workplaceId = 1;
    return expectToThrowWith(employment, WorkplaceNotFoundError);
  });

  it('throws an error for a missing schedules list', () => {
    const employment = getEmployment();
    delete employment.schedules;
    return expectToThrowWith(employment, ValidationError);
  });

  it('throws an error for a schedule with a missing dayOfWeek', () => {
    const employment = getEmployment();
    delete employment.schedules[0].dayOfWeek;
    return expectToThrowWith(employment, ValidationError);
  });

  it('throws an error for a schedule with dayOfWeek = 0', () => {
    const employment = getEmployment();
    employment.schedules[0].dayOfWeek = 0;
    return expectToThrowWith(employment, ValidationError);
  });

  it('throws an error for a schedule with a missing startTime', () => {
    const employment = getEmployment();
    delete employment.schedules[0].startTime;
    return expectToThrowWith(employment, ValidationError);
  });

  it('throws an error for a schedule with an out-of-range startTime.hour', () => {
    const employment = getEmployment();
    employment.schedules[0].startTime.hours = 24;
    return expectToThrowWith(employment, ValidationError);
  });

  it('throws an error for a schedule with an out-of-range startTime.minutes', () => {
    const employment = getEmployment();
    employment.schedules[0].startTime.minutes = 60;
    return expectToThrowWith(employment, ValidationError);
  });

  it('throws an error for a schedule with a missing endTime', () => {
    const employment = getEmployment();
    delete employment.schedules[0].endTime;
    return expectToThrowWith(employment, ValidationError);
  });

  it('throws an error for a schedule with an endTime with the hours missing', () => {
    const employment = getEmployment();
    delete employment.schedules[0].endTime.hours;
    return expectToThrowWith(employment, ValidationError);
  });

  it('throws an error for a schedule with an endTime with the minutes missing', () => {
    const employment = getEmployment();
    delete employment.schedules[0].endTime.minutes;
    return expectToThrowWith(employment, ValidationError);
  });

  it('throws an error for a schedule with an endTime before the startTime', () => {
    const employment = getEmployment();
    employment.schedules[0].endTime = { hours: 0, minutes: 0 };
    employment.schedules[0].startTime = { hours: 0, minutes: 1 };
    return expectToThrowWith(employment, ValidationError);
  });

  it('throws an error for a scheduling conflict', () => {
    const employment = getEmployment();
    employment.schedules = [
      {
        dayOfWeek: 1,
        startTime: { hours: 0, minutes: 0 },
        endTime:  { hours: 1, minutes: 0 },
      },
      {
        dayOfWeek: 1,
        startTime: { hours: 0, minutes: 59 },
        endTime:  { hours: 2, minutes: 0 },
      },
    ];
    return expectToThrowWith(employment, ValidationError);
  });

  it('throws an error for a different scheduling conflict', () => {
    const employment = getEmployment();
    employment.schedules = [
      {
        dayOfWeek: 1,
        startTime: { hours: 0, minutes: 59 },
        endTime:  { hours: 2, minutes: 0 },
      },
      {
        dayOfWeek: 1,
        startTime: { hours: 0, minutes: 0 },
        endTime:  { hours: 1, minutes: 0 },
      },
    ];
    return expectToThrowWith(employment, ValidationError);
  });

  // There's an issue with the web API, so this actually throws a
  // BadRequestError: There was an error updating the employee to workplace
  it.skip("doesn't throw an error for a missing startDate", () => {
    const employment = getEmployment();
    delete employment.startDate;
    return expectNotToThrowWith(employment);
  });

  // There's an issue with the web API, so this actually throws a
  // BadRequestError: There was an error updating the employee to workplace
  it.skip("doesn't throw an error for a missing endDate", () => {
    const employment = getEmployment();
    delete employment.endDate;
    return expectNotToThrowWith(employment);
  });

  it('throws an error for an endDate before the startDate', () => {
    const employment = getEmployment();
    (employment.endDate = new Date()).setDate(-1);
    return expectToThrowWith(employment, ValidationError);
  });
});

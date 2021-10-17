import React from "react";

import { createEmployee } from "../../api/employees";
import { CreateEmployeeScreen } from "../../screens";
import { fireEvent, render } from "../../test-utils";
import { fillInEmployee } from "../helpers/employee";

jest.mock("expo-image-manipulator");
jest.mock("expo-image-picker");
jest.mock("../../api/employees");

const testPhoto =
  "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAGKDAGaAAAFgUlEQVRYw7WXa2wUVRTH/20p7fZBW0p5iAplaUELCqEFlUCMYKwJKMYgaEwIUpQYNCIWRYgvQtTS6AeiKEqIQDBIAEFAEEm1DUVUoIqPVqhCC/IoammhC9vt/vywM7szu7NLLfHMl7n3nP/533vuPefMSHap8wNIoG57pxIYSErZDyCgB8qogTYUeKT+v2C+SlLanqA3v4EBwSdAasAI4CUUcA7wRsiBMbDIjQDQd4M0ogimtkrbMWSgAVzibUIouTIwfc4kJaVIkpT+PTxLiGplkHCo6Wq+uSOydlrYl3jD1xOSAQ5zdzcA1CJJK/ygOEk91kIhAMsQmeMDq9MRg7ojGExIINkrOAm8D4DHSg9QwiQApiDmeQzFWaDE2LUQ4DXjedimsAQaShgbqXj4NM4ISZpmVeTbdt6vGISrWtElfs76Fuig9+9hij7qFjbTs6GecEnxSdKa4DjbK0nFrzWFTI4yE/jVsvDsMaauP0JxX0ARviBgOg0A3GnZaVpO4N3llZRYYZrez8dhC/KRxrBVYSt37TPVgSh6GQN8FFxSQPLOqbsBSP3Wy2gLwJIRQcC91mPIOGyaTaTKARBxbllH7EtqZkJsgCRlvrTbF21JQiS3KN7pkFNH/BMOiJ+nq8vQTTNI8ChZnZabXJs7bxzf9zjAO/8kTLfNxynXwTpze6PlnG8/o16B+fzTfqCRgq1W62nXtYff1X1orjRiqzn2M8TgySlqAFjNuqDxFdIRKpWeag/Vo7zfJWXXei1ep3AaKDYDWypNvhLQnETk1+kWf/hC3iUrdGil0i3lAE8iRM/r1cpm3g0aNzAdgB8sACnvm8Bo0AuSLgLwKMeBQjosTEuCAJu0BSPgjsjo5WS0KyUM4Amqf6aO2cFRPUKU0cLAOhvgsgUAUM4u/PQz9lAGwC5/75eDgFlhAHuxKzNmynGtMwDtvMWOmIBahEjbYAACBWYCzY6A18kx3jI2WXolQJvRKMLqb6g5bbO0AnMPlbwSFdBrpwMA4FkOOwJ6mw08q/J8jChZnhtCR9HdfTo2IP6JyGQrfKbVGZBeETWdB723PwzQ/ZISr1IDchs9IcCtnasbWWMvCC3SNUhm2ophJ2raq9pyjycvjbju1yTje/604IzHllMXmH0256BGRBoPTipaO/jv4ktTPaNaC+rd02I5dqUsdTdUXiaGfOYbdKbPi2bnLkjLO3cszGJx+00fRLoemXlg1qkLVDOOxVyM6v4MM4kLlpQh6cObI22OIcatNh0nJj3X/8S2S3aTFhZwJ9/Z5raTZ71npZKUOWVxhPtDuBD5jZI7c+8DJ8/Giga7GcObzCMxMkFKJWlUYm6ztU0cYbihH7lccbv3cw9z+Tuq+yrG8gptNDGHBEcCSXGDjz7NDG6zWQyYLylhTyDSl1nK7VRYHLfxKmOpjCDcaH5dR5T1obPddekel9f95/BPs/ubwa+wB76acTzPRJ6hOWbYGnkEEb/wqlc96eu2CHAJ1cznLg5Fdf8lBQjxBqv87qbcx2MQJFd5HAjMyrSD0bxN6ABbWUiSQ9f4jQnNA7epjwNBSvWVGATmrX+M+xjjUGbLbHbtLLvU7w/dYf/0OrCV0ZTjjUEQ/WOxzJYh+QiRut5GkP6dz/jBms0kartA0ByWIekbbQQ9DnXYHG2gkIJOE7gc5jK32AgyavwOZ/A504N/AjG/px2entvtxf5Hoh5yByspZMN/JMjZbQ/RwRrf1W5RLZMY3Pkd7Ii8q5N71y9rae/CLbI/PY5qfKyk7ttvy13nj3aBIN6XslwZnW2TcX1KMlre8vk7RZB6QsVd7ccD3dUPXTwVhSCuI+lD80fi2iQhb1H+X5ssBEmn9KD+B7k54yut0XX/HfgvpUkmTvPggOsAAAAASUVORK5CYII=";

describe("tests for adding a new employee", () => {
  beforeEach(() => jest.resetAllMocks());

  it("adds a new employee correctly", async () => {
    const employee = {
      photo: testPhoto,
      idDoc: "123465",
      firstName: "Pepito",
      lastName: "Perez",
      email: "pepitoperez@ontime.com",
      sex: "hombre",
      birthDate: new Date(1989, 2, 14),
      password: "asdf1234",
    };
    const workplaceId = 1;
    const renderResult = render(
      <CreateEmployeeScreen route={{ params: { workplaceId } }} />
    );
    await fillInEmployee(employee, renderResult);

    createEmployee.mockReturnValue(Promise.resolve("OK"));
    fireEvent.press(renderResult.getByText("Guardar"));

    await renderResult.findByText("Empleado creado");
    expect(createEmployee).toHaveBeenCalledWith(employee, workplaceId);
  });

  it("doesn't add a new employee with no ID doc", async () => {
    const employee = {
      photo: testPhoto,
      idDoc: "",
      firstName: "Ricardo",
      lastName: "Martínez",
      email: "ricardomartinez@ontime.com",
      sex: "hombre",
      birthDate: new Date(1985, 5, 25),
      password: "asdf1234",
    };
    const workplaceId = 1;
    const renderResult = render(
      <CreateEmployeeScreen route={{ params: { workplaceId } }} />
    );
    await fillInEmployee(employee, renderResult);

    createEmployee.mockReturnValue(Promise.reject("Error"));
    fireEvent.press(renderResult.getByText("Guardar"));

    await renderResult.findAllByText("*Requerido");
    expect(createEmployee).toHaveBeenCalledTimes(0);
  });

  it("doesn't add a new employee with an ID doc with non-digit chars", async () => {
    const employee = {
      photo: testPhoto,
      idDoc: "145abc",
      firstName: "Marie",
      lastName: "Curie",
      email: "mariecurie@ontime.com",
      sex: "mujer",
      birthDate: new Date(1967, 11, 7),
      password: "asdf1234",
    };
    const workplaceId = 1;
    const renderResult = render(
      <CreateEmployeeScreen route={{ params: { workplaceId } }} />
    );
    await fillInEmployee(employee, renderResult);

    createEmployee.mockReturnValue(Promise.reject("Error"));
    fireEvent.press(renderResult.getByText("Guardar"));

    await renderResult.findAllByText("Debe ser un número");
    expect(createEmployee).toHaveBeenCalledTimes(0);
  });

  it("doesn't add a new employee with an invalid email", async () => {
    const employee = {
      photo: testPhoto,
      idDoc: "654321",
      firstName: "Margaret",
      lastName: "Hamilton",
      email: "margaret.hamilton",
      sex: "mujer",
      birthDate: new Date(1936, 8, 17),
      password: "asdf1234",
    };
    const workplaceId = 1;
    const renderResult = render(
      <CreateEmployeeScreen route={{ params: { workplaceId } }} />
    );
    await fillInEmployee(employee, renderResult);

    createEmployee.mockReturnValue(Promise.reject("Error"));
    fireEvent.press(renderResult.getByText("Guardar"));

    await renderResult.findByText("Correo inválido");
    expect(createEmployee).toHaveBeenCalledTimes(0);
  });
});

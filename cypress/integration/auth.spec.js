// auth.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
function typeCredentials(user) {
  cy.get("input[type=email]").click().type(user["email"]);
  cy.get("input[type=password]").click().type(user["password"]);
  cy.findByRole("button", { name: /Iniciar/i }).click();
}

describe("Login", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Logins admin correctly", () => {
    typeCredentials({
      email: Cypress.env("adminUsername"),
      password: Cypress.env("adminPassword"),
    });
    cy.contains("administrador", { matchCase: false }).should("be.visible");
  });

  it("Logins employee correctly", () => {
    typeCredentials({
      email: Cypress.env("employeeUsername"),
      password: Cypress.env("employeePassword"),
    });
    cy.contains("empleado", { matchCase: false }).should("be.visible");
  });

  it("Logins employer correctly", () => {
    typeCredentials({
      email: Cypress.env("employerUsername"),
      password: Cypress.env("employerPassword"),
    });
    //Find attendance button
    cy.get(".r-pointerEvents-105ug2t > .css-cursor-18t94o4").should(
      "be.visible"
    );
    cy.findAllByText(/sitio/i).should("be.visible");
  });

  it("Does not login with ID", () => {
    typeCredentials({ email: "1098736511", password: "timer" });
    cy.findByText(/correo inválido/i).should("be.visible");
  });

  it("Asks all required inputs", () => {
    cy.findByRole("button", { name: /Iniciar/i }).click();
    cy.findAllByText(/requerido/i).should("be.visible");
    cy.reload();
    cy.findByRole("textbox", { name: /Correo/i })
      .focus()
      .blur();
    cy.findAllByText(/requerido/i).should("be.visible");
  });

  it("Does not login with invalid credentials", () => {
    typeCredentials({
      email: Cypress.env("employerUsername"),
      password: "abcd123",
    });
    cy.findByText(/incorrectos/i).should("be.visible");
  });

  it("Preserves past login", () => {
    typeCredentials({
      email: Cypress.env("employeeUsername"),
      password: Cypress.env("employeePassword"),
    });
    cy.contains("empleado", { matchCase: false }).should("be.visible");
    cy.reload();
    cy.contains("empleado", { matchCase: false }).should("be.visible");
  });
});

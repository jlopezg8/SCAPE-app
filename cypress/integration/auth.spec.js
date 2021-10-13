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
    typeCredentials({ email: "admin@ontime.com", password: "ontime" });
    cy.contains("administrador", { matchCase: false }).should("be.visible");
  });

  it("Logins employee correctly", () => {
    typeCredentials({ email: "employee@ontime.com", password: "ontime" });
    cy.contains("empleado", { matchCase: false }).should("be.visible");
  });

  it("Logins employer correctly", () => {
    typeCredentials({ email: "employeer@ontime.com", password: "ontime" });
    //Find attendance button
    cy.get(".r-pointerEvents-105ug2t > .css-cursor-18t94o4").should(
      "be.visible"
    );
    cy.findAllByText(/sitio/i).should("be.visible");
  });

  it("Does not login with ID", () => {
    typeCredentials({ email: "1098736511", password: "ontime" });
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
    typeCredentials({ email: "employeer@ontime.com", password: "abcd123" });
    cy.findByText(/incorrectos/i).should("be.visible");
  });

  it("Preserves past login", () => {
    typeCredentials({ email: "employee@ontime.com", password: "ontime" });
    cy.contains("empleado", { matchCase: false }).should("be.visible");
    cy.reload();
    cy.contains("empleado", { matchCase: false }).should("be.visible");
  });
});

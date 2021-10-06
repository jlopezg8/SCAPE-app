// auth.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
function typeCredentials(user) {
  cy.get("input[type=email]").click().type(user["email"]);
  cy.get("input[type=password]").click().type(user["password"]);
  cy.findByRole('button', {name: /Iniciar/i}).click()
}

describe("Login", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Logins admin correctly", () => {
    typeCredentials({email:"admin@ontime.com",password:"ontime"})
    cy.contains("administrador", { matchCase: false }).should("exist");
  });

  it("Logins employee correctly", () => {
    typeCredentials({email:"employee@ontime.com",password:"ontime"})
    cy.contains("empleado", { matchCase: false }).should("exist");
  });

  it("Logins employer correctly", () => {
    typeCredentials({email:"employeer@ontime.com",password:"ontime"})
    //Find camera button
    cy.get(
      '[style="background-color: rgb(3, 218, 196); bottom: 96px; box-shadow: rgba(0, 0, 0, 0.24) 0px 5px 6px; opacity: 1; right: 24px; transform: scale(1);"] > .css-cursor-18t94o4'
    ).should("exist");
    //Find plus button
    cy.get(
      '[style="background-color: rgb(3, 218, 196); border-radius: 28px; bottom: 24px; box-shadow: rgba(0, 0, 0, 0.24) 0px 5px 6px; opacity: 1; right: 24px; transform: scale(1);"] > .css-cursor-18t94o4'
    ).should("exist");
  });
});

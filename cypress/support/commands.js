// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import "@testing-library/cypress/add-commands";
import "cypress-file-upload";

Cypress.Commands.add(
  "fetchEmployer",
  (
    user = Cypress.env("employerUsername"),
    pass = Cypress.env("employerPassword")
  ) => {
    return cy
      .request({
        method: "POST",
        url: Cypress.env("loginUrl"),
        form: true,
        body: {
          username: user,
          password: pass,
        },
      })
      .its("body");
  }
);
Cypress.Commands.add("setUser", (user) => {
  localStorage.setItem("access_token", user["access_token"]);
  cy.visit("/", {
    onBeforeLoad(win) {
      // and before the page finishes loading
      // set the user object in local storage
      win.localStorage.setItem("access_token", user["access_token"]);
      win.localStorage.setItem("role", "employer");
    },
  });
});
Cypress.Commands.add("pickPhoto", (image) => {
  cy.findByLabelText(/Tomar o elegir foto/).click();
  cy.findByRole("menuitem", { name: /elegir una foto/i })
    .click()
    .then(() => {
      cy.get('input[type="file"]').last().attachFile(image, { force: true });
    });
});

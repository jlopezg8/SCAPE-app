describe("Register attendance", () => {
  // login just once using API
  let user;
  before(() => {
    cy.fetchEmployer().then((res) => {
      user = res;
    });
  });

  // but set the user before visiting the page
  // so the app thinks it is already authenticated
  beforeEach(() => {
    cy.setUser(user);
    cy.visit("/");
    cy.get(".r-pointerEvents-105ug2t > .css-cursor-18t94o4").click();
  });
  describe("detects employee properly and registers attendances", () => {
    beforeEach(() => {
      const valid_employee = "falcao.png";
      pickPhoto(valid_employee);
    });
    it("registers exit attendance", () => {
      cy.findByText(/Falcao/).should("be.visible");
      cy.findByRole("button", { name: /Registrar Entrada/i }).should(
        "be.visible"
      );
      cy.findByRole("button", { name: /Registrar Salida/i })
        .should("be.visible")
        .click();
      cy.findByText(/registrado la salida/).should("be.visible");
    });
    it("registers entrance attendance", () => {
      cy.findByText(/Falcao/).should("be.visible");
      cy.findByRole("button", { name: /Registrar Salida/i }).should(
        "be.visible"
      );
      cy.findByRole("button", { name: /Registrar Entrada/i })
        .should("be.visible")
        .click();
      cy.findByText(/registrado la entrada/).should("be.visible");
    });
  });

  describe("shows error on bad photo", () => {
    it("rejects photos of two or more people", () => {
      const two_employees = "couple.jpg";
      pickPhoto(two_employees);
      cy.findByText(/sólo una, cara/i).should("be.visible");
    });
    it("rejects invalid employee", () => {
      const invalid_employee = "obama.jpg";
      pickPhoto(invalid_employee);
      cy.findByText(/No corresponde a ningún empleado/i).should("be.visible");
    });
  });
});
function pickPhoto(image) {
  cy.findByLabelText(/Tomar o elegir foto/).click();
  cy.findByRole("menuitem", { name: /elegir una foto/i })
    .click()
    .then(() => {
      cy.get('input[type="file"]').last().attachFile(image, { force: true });
    });
}

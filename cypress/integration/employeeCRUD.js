describe("Adding employees", () => {
  beforeEach(() => {
    cy.visit("http://localhost:19006/");
    cy.get("input[type=email]").click().type("employeer@ontime.com");
    cy.get("input[type=password]").click().type("ontime");
    cy.get("[role=button]").click();
    cy.wait(5000);
    cy.get(
      '[style="background-color: rgb(3, 218, 196); border-radius: 28px; bottom: 24px; box-shadow: rgba(0, 0, 0, 0.24) 0px 5px 6px; opacity: 1; right: 24px; transform: scale(1);"] > .css-cursor-18t94o4'
    ).click();
  });
  //TODO: Detect red
  it("Requires obligatory fields", () => {
    cy.get('input[aria-label="Nombre*"]').focus().blur();
    cy.contains("Guardar").click();
    cy.contains("Requerido").should("exist");
  });
  it("Rejects employee without picture", () => {
    cy.get('input[aria-label="Nombre*"]').click().type("Carlos");
    cy.get('input[aria-label="Apellido*"]').click().type("Gallego");
    cy.get('input[aria-label="Documento de identidad*"]')
      .click()
      .type("1093123123");
    cy.contains("Guardar").click();
    cy.wait(1000);
    cy.contains("No se pudo crear").should("exist");
  });
  it("Adds employee properly", () => {
    cy.get('input[aria-label="Nombre*"]').click().type("Carlos");
    cy.get('input[aria-label="Apellido*"]').click().type("Gallego");
    cy.get('input[aria-label="Documento de identidad*"]')
      .click()
      .type("1093123123");
    //cy.get('.r-marginBottom-zd98yo > :nth-child(1) > .r-cursor-1loqt21 > .css-view-1dbjc4n').click()
    //cy.contains("Elegir una foto").click()
    cy.get('input[aria-label="Correo electrónico"]')
      .click()
      .type("carlos.gallego@gmail.com");
    cy.get('[aria-label="Sexo"]').click();
    cy.contains("Hombre").click();
    //Add Date
    cy.contains("Guardar").click();
    //Assert
  });
});

describe.skip("List employees", () => {
  beforeEach(() => {
    cy.visit("http://localhost:19006/");
    cy.get("input[type=email]").click().type("employeer@ontime.com");
    cy.get("input[type=password]").click().type("ontime");
    cy.get("[role=button]").click();
  });

  it("Shows employee after adding", () => {});

  it("Shows current employees", () => {});
});

describe.skip("Delete employees", () => {
  beforeEach(() => {
    cy.visit("http://localhost:19006/");
    cy.get("input[type=email]").click().type("employeer@ontime.com");
    cy.get("input[type=password]").click().type("ontime");
    cy.get("[role=button]").click();
  });
  it("Shows warning before deleting", () => {});
  it("Deletes the selected employee", () => {});
});

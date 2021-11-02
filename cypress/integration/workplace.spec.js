describe("Workplace list", () => {
  let user;
  before(() => {
    cy.fetchEmployer().then((res) => {
      user = res;
    });
  });
  beforeEach(() => {
    cy.setUser(user);
  });
  it("shows at least one workplace", () => {
    cy.visit("/employer");
    cy.findByText(/TestWorkPlace/).should("be.visible");
  });
  it("message on invalid workplace", () => {
    cy.visit("/employer/workplace/0");
    cy.findByText(/No encontrado/i).should("be.visible");
    cy.findByText(/Radamel Falcao/, { timeout: 10000 }).should("not.exist");
  });
  it("shows workplace info", () => {
    cy.visit("/employer/workplace/3");
    cy.findByText(/Empresa de Metales/).should("exist");
    cy.findByText(/Malteria/).should("exist");
    cy.findByText(/Zona industrial de Manizales/).should("exist");
  });

  it("shows error on no connection", () => {
    cy.intercept("GET", "**/api/WorkPlace/", { forceNetworkError: true }).as(
      "getNetworkFailure"
    );
    cy.visit("/employer");
    cy.findByText(/No se pudieron obtener los sitios de trabajo/).should(
      "be.visible"
    );
  });
  it.skip("shows message on no workplaces", () => {
    cy.visit("/employer");
    expect.hasAssertions();
  });
});

describe("Workplace list", () => {
  let user;
  before(() => {
    cy.fetchEmployer().then((res) => {
      user = res;
    });
  });
  beforeEach(() => {
    cy.setUser(user);
    cy.visit("/employer");
  });
  it("shows at least one workplace", () => {
    cy.findByText(/TestWorkPlace/).should("be.visible");
  });
  it("message on invalid workplace", () => {
    cy.visit("/employer/workplace/0");
    cy.findByText(/No encontrado/i).should("be.visible");
    cy.findByText(/Radamel Falcao/, { timeout: 10000 }).should("not.exist");
  });
  it("shows workplace info", () => {
    cy.visit("/employer/workplace/3");
    cy.findByText(/Empresa de Metales/).should("be.visible");
    cy.findByText(/Malteria/).should("be.visible");
    cy.findByText(/Zona industrial de Manizales/).should("be.visible");
  });
  it.skip("shows message on no workplaces", () => {
    expect.hasAssertions();
  });
  /*it.skip("shows error on no connection", () => {
    expect.hasAssertions();
  });*/
});

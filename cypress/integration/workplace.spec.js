//TODO: DRY out dropdown menus y data typing on fields
describe("Workplace CRUD", () => {
  let user;
  let no_workplaces_user;
  before(() => {
    cy.fetchEmployer().then((res) => {
      user = res;
    });
  });
  beforeEach(() => {
    cy.setUser(user);
  });
  describe("Workplace list", () => {
    it("shows at least one workplace", () => {
      cy.visit("/employer");
      cy.findByText(/Empresa de Metales/).should("be.visible");
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
    it("shows message on no workplaces", () => {
      cy.fetchEmployer(
        Cypress.env("noWorkplaceEmployer"),
        Cypress.env("employerPassword")
      ).then((res) => {
        no_workplaces_user = res;
        cy.setUser(no_workplaces_user);
      });

      cy.visit("/employer");
      cy.findByText(/No hay sitios de trabajo/i).should("be.visible");
    });
  });

  describe("Workplace add", () => {
    it("requires all expected inputs", () => {
      cy.visit("/employer");
      cy.findByRole("button", { name: /Abrir acciones/i })
        .click()
        .then(() => {
          cy.findByLabelText(/Añadir sitio de trabajo/i).click();
        });
      expectInput();
    });
  });
  describe("Workplace delete", () => {
    it("does not remove on cancel", () => {
      cy.contains("Empresa de Metales")
        .closest("[data-focusable=true]")
        .within(() => {
          cy.findByLabelText(/Abrir menú emergente/).click();
        });
      cy.findByRole("menuitem", { name: /Borrar/i }).click();
      cy.findByText(/¿Borrar sitio de trabajo?/).should("be.visible");
      cy.findByRole("button", { name: /Borrar/i }).should("be.visible");
      cy.findByRole("button", { name: /Cancelar/i })
        .as("cancel")
        .should("be.visible");
      cy.get("@cancel").click();
      cy.reload();
      cy.findByText(/Empresa de Metales/).should("exist");
    });
  });
  describe("Workplace edit", () => {
    it("requires all expected inputs", () => {
      cy.contains("Empresa de Metales")
        .closest("[data-focusable=true]")
        .within(() => {
          cy.findByLabelText(/Abrir menú emergente/).click();
        });
      cy.findByRole("menuitem", { name: /Editar/i }).click();
      expectInput();
    });
  });
  /*it.skip("Complete CRUD", () => {
    addWorkplaceProperly();
    editWorkplaceProperly();
    deleteWorkplaceProperly();
  });*/
});

function addWorkplaceProperly() {
  cy.visit("/employer/create-workplace");
  const colanta = {
    Nombre: "Colanta",
    Dirección: "Calle y carrera",
    //Latitud: "-70",
    //Longitud: "50",
  };
  typeData(colanta);
  cy.get("iframe").click({ force: true, release: false });
  cy.findByRole("button", { name: /Guardar/i }).click();
  cy.findByText(/Sitio de trabajo creado/).should("be.visible");
}
function editWorkplaceProperly() {
  cy.visit("/employer");
  cy.contains("Colanta")
    .closest("[data-focusable=true]")
    .within(() => {
      cy.findByLabelText(/Abrir menú emergente/).click();
    });
  cy.findByRole("menuitem", { name: /Editar/i }).click();
  const celema = {
    Nombre: "Celema",
    Dirección: "Carrera y calle",
    //Latitud: "71",
    //Longitud: "-40",
  };
  typeData(celema);
  cy.findByRole("button", { name: /Guardar/i }).click();
  cy.findByText(/Sitio de trabajo editado/).should("be.visible");
}
function deleteWorkplaceProperly() {
  cy.visit("/employer");
  cy.contains("Celema")
    .closest("[data-focusable=true]")
    .within(() => {
      cy.findByLabelText(/Abrir menú emergente/).click();
    });
  cy.findByRole("menuitem", { name: /Borrar/i }).click();
  cy.findByRole("button", { name: /Borrar/i })
    .as("delete")
    .should("be.visible");
  cy.get("@delete").click();
  cy.findByText(/Sitio de trabajo borrado/).should("be.visible");
  cy.findByText(/Celema/).should("not.exist");
}
function typeData(data) {
  Object.keys(data).forEach((key) => fillField(key, data[key]));
}
function fillField(field, data) {
  field = new RegExp(field);
  cy.findByLabelText(field).click().clear().type(data);
}
function expectInput() {
  cy.findByLabelText(/Nombre/)
    .focus()
    .clear()
    .blur();
  cy.findByLabelText(/Dirección/)
    .focus()
    .clear()
    .blur();
  cy.findByRole("button", { name: /Guardar/ }).click();
  cy.findAllByText("*Requerido").should("be.visible");
}

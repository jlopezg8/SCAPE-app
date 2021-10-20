describe("Employee CRUD", () => {
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
    cy.viewport(1280, 800);
    cy.setUser(user);
  });

  describe("Adding employees", () => {
    beforeEach(() => {
      cy.visit("/employer/workplace/1");
      cy.get(
        '[style="display: flex;"] > :nth-child(2) > :nth-child(2) > :nth-child(1) > .r-minHeight-2llsf > .r-flexDirection-1d5kdc7 > :nth-child(1) > :nth-child(1) > .r-pointerEvents-105ug2t > .css-cursor-18t94o4'
      ).click();
    });

    //TODO: Detect red
    it("Requires obligatory fields", () => {
      cy.findByLabelText(/Nombre/)
        .focus()
        .blur();
      cy.findByRole("button", { name: /Guardar/ }).click();
      cy.findAllByText("*Requerido").should("be.visible");
    });
    it("Accepts employee without picture", () => {
      const faceless_employee = {
        Nombre: "Emilia",
        Apellido: "Rodriguez",
        Documento: "1193123121",
        Correo: "emilia.rodriguez@gmail.com",
        Contraseña: "asdf1234",
      };
      typeData(faceless_employee);

      cy.findByRole("button", { name: /Guardar/ }).click();
      cy.findByText(/Empleado creado/).should("be.visible");
      deleteEmployee(faceless_employee["Documento"], user);
    });
    it.skip("Adds employee properly", () => {
      const employee = {
        Nombre: "Carlos",
        Apellido: "Gallardo",
        Documento: "1083123121",
        Correo: "carlos.gallardo@gmail.com",
        Contraseña: "asdf1234",
      };
      /*cy.findByText(/Sexo/)
        .click()
        .then(() => {
          cy.findByRole("menuitem", { name: /intersexo/i }).click();
        });*/
      //Add Date
      cy.pickPhoto("carlos.png");
      typeData(employee);
      cy.findByRole("button", { name: /Guardar/ }).click();
      cy.findByText(/Empleado creado/).should("be.visible");
      deleteEmployee(employee["Documento"], user);
    });
  });

  describe("List employees", () => {
    beforeEach(() => {
      cy.visit("/employer/workplace/1");
    });

    it.skip("Shows employee after adding", () => {});

    it("Shows at least one employee", () => {
      cy.findByText(/Radamel Falcao/).should("be.visible");
    });

    it("Doesn't show any employees on empty workplace", () => {
      cy.visit("/employer/workplace/2");
      cy.findByText(/No hay empleados/).should("be.visible");
      cy.findByText(/Radamel Falcao/, { timeout: 10000 }).should("not.exist");
    });
    it("Message on invalid workplace", () => {
      cy.visit("/employer/workplace/0");
      cy.findByText(/No fue encontrado/i).should("be.visible");
      cy.findByText(/Radamel Falcao/, { timeout: 10000 }).should("not.exist");
    });
  });

  describe("delete employees", () => {
    beforeEach(() => {
      cy.visit("/employer/workplace/1");
    });
    it("Shows warning before deleting", () => {
      cy.contains("Jimy Hendrix")
        .closest("[data-focusable=true]")
        .within(() => {
          cy.findByLabelText(/Abrir menú emergente/).click();
        });
      cy.findByRole("menuitem", { name: /Borrar/i }).click();
      cy.findByText(/¿Borrar empleado?/).should("be.visible");
      cy.findByRole("button", { name: /Borrar/i }).should("be.visible");
      cy.findByRole("button", { name: /Cancelar/i })
        .as("cancel")
        .should("be.visible");
      cy.get("@cancel").click();
      cy.reload();
      cy.findByText(/Jimy Hendrix/).should("be.visible");
    });
  });

  describe("edit employees", () => {
    beforeEach(() => {
      cy.visit("/employer/workplace/1");
    });
    it.skip("Shows warning before modify", () => {});
    it("modifies employee properly", () => {
      const jimi = {
        Nombre: "Jimi",
        Correo: "jimi.hen@gmail.com",
        Documento: "1093123121",
        Contraseña: "asdf4321",
      };
      cy.findByText(/Jimy Hendrix/).click();
      typeData(jimi);
      cy.findByRole("button", { name: /Guardar/ }).click();
      cy.findByText(/Empleado editado/).should("be.visible");
      cy.visit("/employer/workplace/1");
      cy.findByText(/Jimi Hendrix/).should("be.visible");
      restoreHendrix();
    });
    it.skip("changes photo", () => {
      cy.findByText(/Jimy Hendrix/).click();
    });
  });

  it.skip("Adds, lists, modifies and deletes employee properly", () => {});
});

function typeData(data) {
  Object.keys(data).forEach((key) => fillField(key, data[key]));
}
function fillField(field, data) {
  field = new RegExp(field);
  cy.findByLabelText(field).click().clear().type(data);
}
function deleteEmployee(idDoc, user) {
  return cy
    .request({
      method: "DELETE",
      url: Cypress.env("employeeUrl") + "/" + idDoc,
      auth: {
        bearer: user["access_token"],
      },
    })
    .its("body");
}
//Fancy this up
function restoreHendrix() {
  const hendrix = {
    Nombre: "Jimy",
    Documento: "5555555555",
    Correo: "jimy.hendrix@hendrix.com",
    Contraseña: "asdf1234",
  };
  cy.findByText(/Jimi Hendrix/).click();
  typeData(hendrix);
  cy.findByRole("button", { name: /Guardar/ }).click();
  cy.findByText(/Empleado editado/).should("be.visible");
  cy.visit("/employer/workplace/1");
  cy.findByText(/Jimy Hendrix/).should("be.visible");
}

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
  beforeEach(() => cy.setUser(user));

  describe("Adding employees", () => {
    beforeEach(() => {
      cy.visit("/employer/workplace/1");
      cy.get(
        '[style="display: flex;"] > :nth-child(2) > :nth-child(2) > :nth-child(1) > .r-minHeight-2llsf > .r-flexDirection-1d5kdc7 > :nth-child(1) > :nth-child(1) > .r-pointerEvents-105ug2t > .css-cursor-18t94o4'
      ).click();
    });

    //TODO: Detect red
    it("Requires obligatory fields", () => {
      cy.get('input[aria-label="Nombre*"]').focus().blur();
      cy.contains("Guardar").click();
      cy.contains("Requerido").should("exist");
    });
    it.skip("Accepts employee without picture", () => {
      typeData(null);
      cy.findByRole("button", { name: /Guardar/ }).click();
      cy.findByText(/No se pudo crear/i).should("not.be.visible");
    });
    it.skip("Adds employee properly", () => {
      //cy.get('.r-marginBottom-zd98yo > :nth-child(1) > .r-cursor-1loqt21 > .css-view-1dbjc4n').click()
      //cy.contains("Elegir una foto").click()

      cy.get('[aria-label="Sexo"]').click();
      //cy.get('[role="menuitem"]').find(':contains("Hombre")').click({multiple:true});
      //Add Date
      cy.contains("Guardar").click();
      //Assert
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

  describe.skip("edit employees", () => {
    beforeEach(() => {
      cy.visit("/employer/workplace/1");
    });
    it.skip("Shows warning before modify", () => {});
    it("modifies employee properly", () => {});
  });

  it.skip("Adds, lists, modifies and deletes employee properly", () => {});
});

function typeData(data) {
  fillField("Nombre*", "Carlos");
  fillField("Apellido*", "Gallego");
  fillField("Documento de identidad*", "1093123122");
  fillField("Correo electrónico", "carlos.gallego@gmail.com");
}
function fillField(field, data) {
  cy.get('input[aria-label="' + field + '"]')
    .click()
    .type(data);
}
/*describe('JWT', () => {
  it.skip('makes authenticated request', () => {
  // we can make authenticated request ourselves
  // since we know the token
    cy.request({
      url: 'http://localhost:4000/users',
      auth: {
        bearer: user.token,
      },
    })
    .its('body')
    .should('deep.equal', [
      {
        id: 1,
        username: 'test',
        firstName: 'Test',
        lastName: 'User',
      },
    ])
  })

  it('is logged in', () => {
    cy.contains('administrador').should('be.visible')
  })

  it.skip('shows loaded user', () => {
  // this user information came from authenticated XHR call
    cy.contains('li', 'Test User').should('be.visible')
  })
})*/

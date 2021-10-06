describe('Employee CRUD',()=>{
  // login just once using API  
let user
let baseURL = Cypress.env('loginUrl')
before(function fetchUser () {
  cy.request(
    {method:'POST',
    url:baseURL, form:true,body:{
    username: Cypress.env('employerUsername'),
    password: Cypress.env('employerPassword'),
  }})  
  .its('body')
  .then((res) => {
    user = res
  })
})

// but set the user before visiting the page
// so the app thinks it is already authenticated
beforeEach(function setUser () {
  localStorage.setItem('access_token', user['access_token'])
  cy.visit('/', {
    onBeforeLoad (win) {
      // and before the page finishes loading
      // set the user object in local storage
      win.localStorage.setItem('access_token', user['access_token'])
      win.localStorage.setItem('role', 'employer')
    },
  })
  // the page should be opened and the user should be logged in
})

describe("Adding employees", () => {
  beforeEach(() => {
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
  it.skip("Adds employee properly", () => {
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
    //cy.get('[role="menuitem"]').find(':contains("Hombre")').click({multiple:true});
    //Add Date
    cy.contains("Guardar").click();
    //Assert
  });
});

describe.skip("List employees", () => {
  beforeEach(() => {
    
  });

  it("Shows employee after adding", () => {});

  it("Shows current employees", () => {});
});

describe.skip("Delete employees", () => {
  beforeEach(() => {  });
  it("Shows warning before deleting", () => {});
  it("Deletes the selected employee", () => {});
});

})



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
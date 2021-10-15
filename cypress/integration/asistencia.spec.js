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
  describe("Detects employee properly and registers attendances", () => {
    beforeEach(() => {
      pickPhoto();
    });
    it.skip("Registers Entrance attendance", () => {
      cy.findByText().should("be.visible");
    });
    it.skip("Registers Exit attendance", () => {
      cy.pause();
    });
    it("Shows error because base64 is screwed :v", () => {
      cy.findByText(/Base-64/i).should("be.visible");
    });
  });

  it.skip("Shows error on bad photo", () => {
    expect.hasAssertions();
  });
});
function pickPhoto() {
  const falcao = "falcao.png";

  cy.get(
    ".r-alignSelf-1kihuf0 > :nth-child(1) > .r-cursor-1loqt21 > .css-view-1dbjc4n"
  ).click();
  cy.findByRole("menuitem", { name: /elegir una foto/i })
    .click()
    .then(() => {
      cy.get('input[type="file"]').last().attachFile(falcao);
    });
}

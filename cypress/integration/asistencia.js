describe.skip("Register attendance", () => {
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
  it("Detects employee properly", () => {
    //Select photo
  });
  it("Registers Entrance attendance", () => {
    //Select photo
  });
  it("Registers Exit attendance", () => {
    //Select photo
  });
  it("Shows error on bad photo", () => {
    //Select photo
  });
});

/// <reference types="cypress" />

describe("New User", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should show category totals", () => {
    cy.getTestId("NetWorth-net-total").contains("$75.00");
    cy.getTestId("NetWorth-assets-total").contains("$100.00");
    cy.getTestId("NetWorth-liabilities-total").contains("$25.00");
  });
});

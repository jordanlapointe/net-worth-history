/// <reference types="cypress" />

describe("New User", () => {
  beforeEach(() => {
    Cypress.on("window:before:load", (window) => {
      window.indexedDB.deleteDatabase("appDatabase");
    });
    cy.visit("/");
  });

  it("should show category totals", () => {
    cy.getTestId("NetWorth-net-total").contains("$270.00");
    cy.getTestId("NetWorth-assets-total").contains("$290.00");
    cy.getTestId("NetWorth-liabilities-total").contains("$20.00");
  });

  it("should show chart values", () => {
    cy.getTestId("NetWorth-chart-button-0").contains("$235.00");
    cy.getTestId("NetWorth-chart-button-1").contains("$270.00");
    cy.getTestId("NetWorth-assetsChart-button-0").contains("$260.00");
    cy.getTestId("NetWorth-assetsChart-button-1").contains("$290.00");
    cy.getTestId("NetWorth-liabilitiesChart-button-0").contains("$25.00");
    cy.getTestId("NetWorth-liabilitiesChart-button-1").contains("$20.00");
  });

  it("should click toggle and show future chart values", () => {
    cy.contains("Future").click();
    cy.getTestId("NetWorth-futureChart-button-0").contains(
      "$270.00, $270.00, $270.00"
    );
    cy.getTestId("NetWorth-futureChart-button-119").contains(
      "$38,821.58, $36,723.41, $40,919.76"
    );
  });

  it("should show category totals in nav", () => {
    cy.getTestId("Nav-netWorth").contains("$270");
    cy.getTestId("NavAccountList-assetTotal").contains("$290");
    cy.getTestId("NavAccountList-liabilityTotal").contains("$20");
  });

  it("should show account values in nav", () => {
    cy.getTestId("Nav-netWorth").contains("$270");
    cy.getTestId("NavAccountList-assetTotal").contains("$290");
    cy.getTestId("NavAccountList-liabilityTotal").contains("$20");
    cy.getTestId("NavAccountList-asset-2").contains("$70");
    cy.getTestId("NavAccountList-asset-3").contains("$220");
    cy.getTestId("NavAccountList-liability-1").contains("$20");
  });
});

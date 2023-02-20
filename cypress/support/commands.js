Cypress.Commands.add("getTestId", (id, ...args) => {
  return cy.get(`[data-testid=${id}]`, ...args);
});

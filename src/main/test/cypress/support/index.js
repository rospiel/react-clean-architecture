Cypress.Commands.add('getByTestId', function (id) {
  cy.get(`[data-testid=${id}]`)
})

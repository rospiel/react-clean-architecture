export function mockResponse (method: string, url: RegExp, status: number, response: object): Cypress.Chainable<null> {
    cy.server()
    return cy.route({
      method,
      url,
      status,
      response
    })
  }
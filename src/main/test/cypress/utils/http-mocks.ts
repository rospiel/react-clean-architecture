export function mockResponse (method: string, url: RegExp, status: number, response: string | object): Cypress.Chainable<null> {
    cy.server()
    return cy.route({
      method,
      url,
      status,
      response
    })
  }
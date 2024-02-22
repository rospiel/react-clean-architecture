import { Method } from "cypress/types/net-stubbing";

export function mockResponse (method: Method, url: RegExp, statusCode: number, response: string | object): Cypress.Chainable<null> {
  return cy.intercept(
    method, 
    url, 
    {
      statusCode,
      fixture: response
    }
  )
}

export function mockResponseBy (method: Method, path: string, statusCode: number, response: string): Cypress.Chainable<null> {
  return cy.intercept(
    method, 
    path, 
    {
      statusCode, 
      fixture: response
    }
  )
}

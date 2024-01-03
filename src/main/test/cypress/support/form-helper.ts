const BASE_URL: string = Cypress.config().baseUrl

export function testInputStatus (fieldName: string, errorMessage: string, lightSymbol: string): void {
    cy.getByTestId(fieldName)
      .should('have.attr', 'title', errorMessage)
      .should('contain.text', lightSymbol)
}

export function testInputStatusSuccess (fieldName: string): void {
    testInputStatus(fieldName, 'Tudo certo', '🟢')
}

export function testInputStatusFailure (fieldName: string): void {
    testInputStatus(fieldName, 'Valor inválido', '🔴')
}

export function testContainerError (errorMessage: string): void {
    cy.getByTestId('error-container')
      .getByTestId('spinner')
      .should('not.exist')
      .getByTestId('error-message')
      .should('contain.text', errorMessage)
}

export function focusAndSetValueInput (fieldName: string, value: string): void {
    cy.getByTestId(fieldName)
    .focus()
    .type(value)
}

export function submitFormByEnter (fieldName: string, value: string): void {
    cy.getByTestId(fieldName)
      .focus()
      .type(value)
      /* simulate enter click to submit */
      .type('{enter}')
}

export function testUrl (path: string): void {
    cy.url().should('eq', `${BASE_URL}${path}`)
}

export function checkItemLocalStorage (keyName: string): void {
    cy.window().then(window => assert.isOk(window.localStorage.getItem(keyName)))
}
const BASE_URL: string = Cypress.config().baseUrl

export function testUrl (path: string): void {
    cy.url().should('eq', `${BASE_URL}${path}`)
}

export function checkItemLocalStorage (keyName: string): void {
    cy.window().then(window => assert.isOk(window.localStorage.getItem(keyName)))
}

export function setLocalStorageItem (keyName: string, value: object): void {
    localStorage.setItem(keyName, JSON.stringify(value))
}

export function getLocalStorageItem (keyName: string): any {
    return JSON.parse(localStorage.getItem(keyName))
}
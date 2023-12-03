import faker from 'faker'
import react from 'react'

const BASE_URL: string = Cypress.config().baseUrl
const EMAIL_ELEMENT = 'email'
const EMAIL_STATUS_ELEMENT = 'email-status'
const PASSWORD_ELEMENT = 'password'
const PASSWORD_STATUS_ELEMENT = 'password-status'
const SUBMIT_ELEMENT = 'submit'
const ERROR_ELEMENT = 'error-container'

describe('Login', function () {
  this.beforeEach(function () {
    cy.visit('login')
  })

  it('Should load with correct initial state', function () {
    cy.getByTestId(EMAIL_ELEMENT)
      .should('have.attr', 'readOnly')

    cy.getByTestId(EMAIL_STATUS_ELEMENT)
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('contain.text', '🔴')

    cy.getByTestId(PASSWORD_ELEMENT)
      .should('have.attr', 'readOnly')

    cy.getByTestId(PASSWORD_STATUS_ELEMENT)
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('contain.text', '🔴')

    cy.getByTestId(SUBMIT_ELEMENT)
      .should('have.attr', 'disabled')

    cy.getByTestId(ERROR_ELEMENT)
      .should('not.have.descendants')
  })

  it('Should show error when form is invalid', function () {
    cy.getByTestId(EMAIL_ELEMENT)
      .focus()
      .type(faker.random.alphaNumeric(3))

    cy.getByTestId(EMAIL_STATUS_ELEMENT)
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴')

    cy.getByTestId(PASSWORD_ELEMENT)
      .focus()
      .type(faker.random.alphaNumeric(3))

    cy.getByTestId(PASSWORD_STATUS_ELEMENT)
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴')
  })

  it('Should allow submit when form is valid', function () {
    cy.getByTestId(EMAIL_ELEMENT)
      .focus()
      .type(faker.internet.email())

    cy.getByTestId(EMAIL_STATUS_ELEMENT)
      .should('have.attr', 'title', 'Tudo certo')
      .should('contain.text', '🟢')

    cy.getByTestId(PASSWORD_ELEMENT)
      .focus()
      .type(faker.random.alphaNumeric(5))

    cy.getByTestId(PASSWORD_STATUS_ELEMENT)
      .should('have.attr', 'title', 'Tudo certo')
      .should('contain.text', '🟢')

    cy.getByTestId(SUBMIT_ELEMENT)
      .should('not.have.attr', 'disabled')

    cy.getByTestId(ERROR_ELEMENT)
      .should('not.have.descendants')
  })

  it('Should show error when credentials failed', function () {
    cy.getByTestId(EMAIL_ELEMENT)
      .focus()
      .type(faker.internet.email())

    cy.getByTestId(PASSWORD_ELEMENT)
      .focus()
      .type(faker.random.alphaNumeric(5))

    cy.getByTestId(SUBMIT_ELEMENT).click()

    cy.getByTestId(ERROR_ELEMENT)
      .getByTestId('spinner')
      .should('exist')
      .getByTestId('error-message')
      .should('not.exist')
      .getByTestId('spinner')
      .should('not.exist')
      .getByTestId('error-message')
      .should('contain.text', 'Credenciais inválidas')

    cy.url().should('eq', `${BASE_URL}/login`)
  })

  it('Should save access token on local storage when credentials succeed ', function () {
    cy.getByTestId(EMAIL_ELEMENT)
      .focus()
      .type('t@t.com')

    cy.getByTestId(PASSWORD_ELEMENT)
      .focus()
      .type('123456')

    cy.getByTestId(SUBMIT_ELEMENT).click()

    cy.getByTestId(ERROR_ELEMENT)
      .getByTestId('spinner')
      .should('exist')
      .getByTestId('error-message')
      .should('not.exist')
      .getByTestId('spinner')
      .should('not.exist')

    cy.url().should('eq', `${BASE_URL}/`)

    cy.window().then(window => assert.isOk(window.localStorage.getItem('accessToken')))
  })
})

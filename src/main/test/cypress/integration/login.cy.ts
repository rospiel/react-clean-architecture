import { faker } from '@faker-js/faker'
import react from 'react'
import * as formHelp from '../utils/form-helpers'
import * as herlper from '../utils/helpers'
import { mockResponse } from '../utils/http-mocks'

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

    formHelp.testInputStatus(EMAIL_STATUS_ELEMENT, 'Campo obrigatório', '🔴')

    cy.getByTestId(PASSWORD_ELEMENT)
      .should('have.attr', 'readOnly')

    formHelp.testInputStatus(PASSWORD_STATUS_ELEMENT, 'Campo obrigatório', '🔴')      
    
    cy.getByTestId(SUBMIT_ELEMENT)
      .should('have.attr', 'disabled')

    cy.getByTestId(ERROR_ELEMENT)
      .should('not.have.descendants')
  })

  it('Should show error when form is invalid', function () {
    formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.string.alphanumeric(3))
    
    formHelp.testInputStatus(EMAIL_STATUS_ELEMENT, 'Valor inválido', '🔴')
      
    formHelp.focusAndSetValueInput(PASSWORD_ELEMENT, faker.string.alphanumeric(3))
    
    formHelp.testInputStatus(PASSWORD_STATUS_ELEMENT, 'Valor inválido', '🔴')
  })

  it('Should allow submit when form is valid', function () {
    formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.internet.email())
    
    formHelp.testInputStatus(EMAIL_STATUS_ELEMENT, 'Tudo certo', '🟢')

    formHelp.focusAndSetValueInput(PASSWORD_ELEMENT, faker.string.alphanumeric(5))
    
    formHelp.testInputStatus(PASSWORD_STATUS_ELEMENT, 'Tudo certo', '🟢')

    cy.getByTestId(SUBMIT_ELEMENT)
      .should('not.have.attr', 'disabled')

    cy.getByTestId(ERROR_ELEMENT)
      .should('not.have.descendants')
  })

  it('Should show error when credentials failed', function () {
    mockResponse('POST', /login/, 401, 'error')
    
    formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.internet.email())
    
    formHelp.focusAndSetValueInput(PASSWORD_ELEMENT, faker.string.alphanumeric(5))
    
    cy.getByTestId(SUBMIT_ELEMENT).click()

    formHelp.testContainerError('Credenciais inválidas')
    
    herlper.testUrl('/login')
  })

  it('Should save account on local storage when credentials succeed ', function () {
    mockResponse('POST', /login/, 200, 'account')
    
    formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.internet.email())

    formHelp.focusAndSetValueInput(PASSWORD_ELEMENT, faker.string.alphanumeric(5))
    
    cy.getByTestId(SUBMIT_ELEMENT).click()

    cy.getByTestId(ERROR_ELEMENT)
      .should('not.exist')
      
    herlper.testUrl('/')

    herlper.checkItemLocalStorage('account')
  })

  it('Should not allowed multiple submits', function () {
    mockResponse('POST', /login/, 200, 'account')
      .as('request')
    /* give a name to count requests */
    
    formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.internet.email())
    
    formHelp.focusAndSetValueInput(PASSWORD_ELEMENT, faker.string.alphanumeric(5))
    
    /* simulate double click */
    cy.getByTestId(SUBMIT_ELEMENT).dblclick()

    /* wait to conforme how many times calls service */
    cy.wait('@request')

    /* verify if just call one time */
    cy.get('@request.all').should('have.length', 1)
  })

  it('Should not call external service when form is invalid', function () {
    mockResponse('POST', /login/, 200, 'account')
      .as('request')
    /* give a name to count requests */
    
    formHelp.submitFormByEnter(EMAIL_ELEMENT, faker.string.alphanumeric(5))
    
    /* verify if just call one time */
    cy.get('@request.all').should('have.length', 0)
  })
})

import faker from 'faker'
import react from 'react'
import * as formHelp from '../support/form-helper'
import { mockResponse } from '../support/http-mocks'

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
    formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.random.alphaNumeric(3))
    
    formHelp.testInputStatus(EMAIL_STATUS_ELEMENT, 'Valor inválido', '🔴')
      
    formHelp.focusAndSetValueInput(PASSWORD_ELEMENT, faker.random.alphaNumeric(3))
    
    formHelp.testInputStatus(PASSWORD_STATUS_ELEMENT, 'Valor inválido', '🔴')
  })

  it('Should allow submit when form is valid', function () {
    formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.internet.email())
    
    formHelp.testInputStatus(EMAIL_STATUS_ELEMENT, 'Tudo certo', '🟢')

    formHelp.focusAndSetValueInput(PASSWORD_ELEMENT, faker.random.alphaNumeric(5))
    
    formHelp.testInputStatus(PASSWORD_STATUS_ELEMENT, 'Tudo certo', '🟢')

    cy.getByTestId(SUBMIT_ELEMENT)
      .should('not.have.attr', 'disabled')

    cy.getByTestId(ERROR_ELEMENT)
      .should('not.have.descendants')
  })

  it('Should show error when credentials failed', function () {
    mockResponse('POST', /login/, 401, { error: faker.random.words() })
    
    formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.internet.email())
    
    formHelp.focusAndSetValueInput(PASSWORD_ELEMENT, faker.random.alphaNumeric(5))
    
    cy.getByTestId(SUBMIT_ELEMENT).click()

    formHelp.testContainerError('Credenciais inválidas')
    
    formHelp.testUrl('/login')
  })

  it('Should save access token on local storage when credentials succeed ', function () {
    mockResponse('POST', /login/, 200, { accessToken: faker.random.uuid() })
    
    formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.internet.email())

    formHelp.focusAndSetValueInput(PASSWORD_ELEMENT, faker.random.alphaNumeric(5))
    
    cy.getByTestId(SUBMIT_ELEMENT).click()

    cy.getByTestId(ERROR_ELEMENT)
      .should('not.exist')
      
    formHelp.testUrl('/')

    formHelp.checkItemLocalStorage('accessToken')
  })

  it('Should present UnexpectedError on default error', function () {
    mockResponse('POST', /login/, faker.helpers.randomize([400, 404, 500]), { error: faker.random.uuid() })

    formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.internet.email())
    
    formHelp.focusAndSetValueInput(PASSWORD_ELEMENT, faker.random.alphaNumeric(5))
    
    cy.getByTestId(SUBMIT_ELEMENT).click()

    formHelp.testContainerError('Instabilidade no sistema. Tente novamente em breve.')
    
    formHelp.testUrl('/login')
  })

  it('Should present UnexpectedError when invalid data is returned', function () {
    const invalidProperty: string = faker.random.words()
    mockResponse('POST', /login/, 200, { invalidProperty: faker.random.uuid() })
    
    formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.internet.email())
    
    formHelp.submitFormByEnter(PASSWORD_ELEMENT, faker.random.alphaNumeric(5))
    
    formHelp.testContainerError('Instabilidade no sistema. Tente novamente em breve.')
    
    formHelp.testUrl('/login')
  })

  it('Should not allowed multiple submits', function () {
    mockResponse('POST', /login/, 200, { accessToken: faker.random.uuid() })
      .as('request')
    /* give a name to count requests */
    
    formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.internet.email())
    
    formHelp.focusAndSetValueInput(PASSWORD_ELEMENT, faker.random.alphaNumeric(5))
    
    /* simulate double click */
    cy.getByTestId(SUBMIT_ELEMENT).dblclick()

    /* verify if just call one time */
    cy.get('@request.all').should('have.length', 1)
  })

  it('Should not call external service when form is invalid', function () {
    mockResponse('POST', /login/, 200, { accessToken: faker.random.uuid() })
      .as('request')
    /* give a name to count requests */
    
    formHelp.submitFormByEnter(EMAIL_ELEMENT, faker.random.alphaNumeric(5))
    
    /* verify if just call one time */
    cy.get('@request.all').should('have.length', 0)
  })
})

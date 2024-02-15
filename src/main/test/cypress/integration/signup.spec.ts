import faker from 'faker'
import react from 'react'
import * as formHelp from '../utils/form-helpers'
import * as helper from '../utils/helpers'
import { mockResponse } from '../utils/http-mocks'

const EMAIL_ELEMENT = 'email'
const EMAIL_STATUS_ELEMENT = 'email-status'
const PASSWORD_ELEMENT = 'password'
const PASSWORD_STATUS_ELEMENT = 'password-status'
const NAME_ELEMENT = 'name'
const NAME_STATUS_ELEMENT = 'name-status'
const PASSWORD_CONFIRMATION_ELEMENT = 'passwordConfirmation'
const PASSWORD_CONFIRMATION_STATUS_ELEMENT = 'passwordConfirmation-status'
const SUBMIT_ELEMENT = 'submit'
const ERROR_ELEMENT = 'error-container'

function buildCompletedValidForm (): void {
  formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.internet.email())

  formHelp.testInputStatusSuccess(EMAIL_STATUS_ELEMENT)

  const password: string = faker.random.alphaNumeric(6)
  formHelp.focusAndSetValueInput(PASSWORD_ELEMENT, password)

  formHelp.testInputStatusSuccess(PASSWORD_STATUS_ELEMENT)
  
  formHelp.focusAndSetValueInput(NAME_ELEMENT, faker.name.findName())

  formHelp.testInputStatusSuccess(NAME_STATUS_ELEMENT)

  formHelp.focusAndSetValueInput(PASSWORD_CONFIRMATION_ELEMENT, password)

  formHelp.testInputStatusSuccess(PASSWORD_CONFIRMATION_STATUS_ELEMENT)
}


describe('SignUp', function () {
  this.beforeEach(function () {
    cy.visit('signup')
  })

  it('Should load with correct initial state', function () {
    cy.getByTestId(EMAIL_ELEMENT)
      .should('have.attr', 'readOnly')

    formHelp.testInputStatus(EMAIL_STATUS_ELEMENT, 'Campo obrigatório', '🔴')

    cy.getByTestId(PASSWORD_ELEMENT)
      .should('have.attr', 'readOnly')

    formHelp.testInputStatus(PASSWORD_STATUS_ELEMENT, 'Campo obrigatório', '🔴') 
    
    cy.getByTestId(NAME_ELEMENT)
      .should('have.attr', 'readOnly')

    formHelp.testInputStatus(NAME_STATUS_ELEMENT, 'Campo obrigatório', '🔴') 

    cy.getByTestId(PASSWORD_CONFIRMATION_ELEMENT)
      .should('have.attr', 'readOnly')

    formHelp.testInputStatus(PASSWORD_CONFIRMATION_STATUS_ELEMENT, 'Campo obrigatório', '🔴') 
    
    cy.getByTestId(SUBMIT_ELEMENT)
      .should('have.attr', 'disabled')

    cy.getByTestId(ERROR_ELEMENT)
      .should('not.have.descendants')
  })

  it('Should show error when form is invalid', function () {
    formHelp.focusAndSetValueInput(EMAIL_ELEMENT, faker.random.alphaNumeric(1))

    formHelp.testInputStatusFailure(EMAIL_STATUS_ELEMENT)

    formHelp.focusAndSetValueInput(PASSWORD_ELEMENT, faker.random.alphaNumeric(1))

    formHelp.testInputStatusFailure(PASSWORD_STATUS_ELEMENT) 
    
    formHelp.focusAndSetValueInput(NAME_ELEMENT, faker.random.alphaNumeric(1))

    formHelp.testInputStatusFailure(NAME_STATUS_ELEMENT) 

    formHelp.focusAndSetValueInput(PASSWORD_CONFIRMATION_ELEMENT, faker.random.alphaNumeric(2))

    formHelp.testInputStatusFailure(PASSWORD_CONFIRMATION_STATUS_ELEMENT) 
  })

  it('Should allow submit when form is valid', function () {
    buildCompletedValidForm()
    
    cy.getByTestId(SUBMIT_ELEMENT)
      .should('not.have.attr', 'disabled')

    cy.getByTestId(ERROR_ELEMENT)
      .should('not.have.descendants')
  })

  it('Should throw EmailInUseError when email already in use', function () {
    mockResponse('POST', /signup/, 403, { error: faker.random.words() })
    
    buildCompletedValidForm()
    
    cy.getByTestId(SUBMIT_ELEMENT).click()

    formHelp.testContainerError('Esse e-mail já tem uma conta atrelada')
    
    helper.testUrl('/signup')
  })

  it('Should save account on local storage when credentials succeed ', function () {
    mockResponse('POST', /signup/, 200, 'fx:account')
    
    buildCompletedValidForm()
    
    cy.getByTestId(SUBMIT_ELEMENT).click()

    cy.getByTestId(ERROR_ELEMENT)
      .should('not.exist')
      
    helper.testUrl('/')

    helper.checkItemLocalStorage('account')
  })

  it('Should not allowed multiple submits', function () {
    mockResponse('POST', /signup/, 200, 'fx:account')
      .as('request')
    /* give a name to count requests */
    
    buildCompletedValidForm()
    
    /* simulate double click */
    cy.getByTestId(SUBMIT_ELEMENT).dblclick()

    /* verify if just call one time */
    cy.get('@request.all').should('have.length', 1)
  })

  it('Should not call external service when form is invalid', function () {
    mockResponse('POST', /signup/, 200, { account: faker.random.uuid() })
      .as('request')
    /* give a name to count requests */
    
    buildCompletedValidForm()

    formHelp.submitFormByEnter(PASSWORD_CONFIRMATION_ELEMENT, faker.random.alphaNumeric(5))
    
    /* verify if just call one time */
    cy.get('@request.all').should('have.length', 0)
  })
})

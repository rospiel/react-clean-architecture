import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { AuthenticationSpy, ValidationStub, Helper } from '@/presentation/test'
import { faker } from '@faker-js/faker'
import { InvalidCredentialsError } from '@/domain/errors'
import { BrowserRouter } from 'react-router-dom'
import ApiContext from '@/presentation/contexts/api/api-context'
import { AccountModel } from '@/domain/models'

type screenTypes = {
  authenticationSpy: AuthenticationSpy
  setCurrentAccountMock: (account: AccountModel) => void
}

function makeSut (errorMessage?: string): screenTypes {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const setCurrentAccountMock = jest.fn()
  validationStub.errorMessage = errorMessage
  
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </ApiContext.Provider>, 
    {wrapper: BrowserRouter}
  )
  return {
    authenticationSpy, 
    setCurrentAccountMock
  }
}

async function simulateSubmit (email = faker.internet.email(), password = faker.internet.password()): Promise<void> {
  Helper.populateInput('email', email)
  Helper.populateInput('password', password)

  const button = screen.getByTestId('submit')
  fireEvent.click(button)
  /* because the call is async wait until finish, necessary pass a element that is always in the screen to listening  */
  await waitFor(() => button)
}

describe('Login component', () => {
  /* Won't necessary on news versions */
  /* afterEach(cleanup) /* clean after every test */

  test('Should initialize with some rules', () => {
    const errorMessage = faker.word.words()
    makeSut(errorMessage)
    const errorWrap = screen.getByTestId('error-container')
    expect(errorWrap.childElementCount).toBe(0)

    const submitButton = screen.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)

    // Helper.testContainerChildCount(0, 'error-container')
    // Helper.testButtonIsDisabled('submit', true)
    expect(screen.getByTestId('submit')).toBeDisabled()
    expect(screen.getByTestId('error-container').children).toHaveLength(0)
    Helper.testStatusForField('email', errorMessage)
    Helper.testStatusForField('password', errorMessage)
  })

  test('Should show error message when email validation fails', () => {
    const errorMessage = faker.word.words()
    makeSut(errorMessage)
    Helper.populateInput('email', faker.internet.email())
    Helper.testStatusForField('email', errorMessage)
  })

  test('Should show error message when password validation fails', () => {
    const errorMessage = faker.word.words()
    makeSut(errorMessage)
    Helper.populateInput('password', faker.internet.password())
    Helper.testStatusForField('password', errorMessage)
  })

  test('Should show valid password when validation succeeds', () => {
    makeSut()
    Helper.populateInput('password', faker.internet.password())
    Helper.testStatusForField('password')
  })

  test('Should show valid email when validation succeeds', () => {
    makeSut()
    Helper.populateInput('email', faker.internet.email())
    Helper.testStatusForField('password')
  })

  test('Should enable submit button when without errors', () => {
    makeSut()

    Helper.populateInput('email', faker.internet.email())
    Helper.populateInput('password', faker.internet.password())

    // Helper.testButtonIsDisabled('submit', false)
    expect(screen.getByTestId('submit')).toBeEnabled()
  })

  test('Should show spinner when form submit', async () => {
    makeSut()

    await simulateSubmit(faker.internet.email(), faker.internet.password())

    // Helper.testElementExists('spinner')
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  test('Should call Authentication Service with correct values', async () => {
    const { authenticationSpy } = makeSut()

    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateSubmit(email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('Should call authentication one time only', async () => {
    const { authenticationSpy } = makeSut()
    await simulateSubmit()
    await simulateSubmit()
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', async () => {
    const errorMessage = faker.word.words()
    const { authenticationSpy } = makeSut(errorMessage)
    await simulateSubmit()
    expect(authenticationSpy.callsCount).toBe(0)
  })

  /* async when test depends external call */
  test('Should show errorMessage if authentication fails', async () => {
    const { authenticationSpy } = makeSut()

    const error = new InvalidCredentialsError()
    /* mock return */
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))

    await simulateSubmit()

    // Helper.testElementText('error-message', error.message)
    expect(screen.getByTestId('error-message')).toHaveTextContent(error.message)
    /* confirm that the loading is hidden */
    // Helper.testContainerChildCount(1, 'error-container')
    expect(screen.getByTestId('error-container').children).toHaveLength(1)
  })

  test('Should call UpdateCurrentAccount on success', async () => {
    const { authenticationSpy, setCurrentAccountMock } = makeSut()
    await simulateSubmit()
    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account)
  })

  test('Should redirect to signup page', () => {
    makeSut()
    const register = screen.getByTestId('signup')
    fireEvent.click(register)
    expect(global.window.location.href).toContain('/signup')
  })
})

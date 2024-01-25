import React from 'react'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { AuthenticationSpy, ValidationStub, UpdateCurrentAccountMock, Helper } from '@/presentation/test'
import faker from 'faker'
import { InvalidCredentialsError } from '@/domain/errors'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  updateCurrentAccountMock: UpdateCurrentAccountMock
}

const history = createMemoryHistory({ initialEntries: ['/login'] })
function makeSut (errorMessage?: string): SutTypes {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const updateCurrentAccountMock = new UpdateCurrentAccountMock()
  validationStub.errorMessage = errorMessage
  const sut = render(
    /* necessarily Router when the component uses link from react-router */
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy} updateCurrentAccount={updateCurrentAccountMock} />
    </Router>
  )
  return {
    sut,
    authenticationSpy, 
    updateCurrentAccountMock
  }
}

async function simulateSubmit (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> {
  Helper.populateInput(sut, 'email', email)
  Helper.populateInput(sut, 'password', password)

  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  /* because the call is async wait until finish, necessary pass a element that is always in the screen to listening  */
  await waitFor(() => form)
}

describe('Login component', () => {
  afterEach(cleanup) /* clean after every test */

  test('Should initialize with some rules', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut(errorMessage)
    const errorWrap = sut.getByTestId('error-container')
    expect(errorWrap.childElementCount).toBe(0)

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)

    Helper.testContainerChildCount(sut, 0, 'error-container')
    Helper.testButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut, 'email', errorMessage)
    Helper.testStatusForField(sut, 'password', errorMessage)
  })

  test('Should show error message when email validation fails', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut(errorMessage)
    Helper.populateInput(sut, 'email', faker.internet.email())
    Helper.testStatusForField(sut, 'email', errorMessage)
  })

  test('Should show error message when password validation fails', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut(errorMessage)
    Helper.populateInput(sut, 'password', faker.internet.password())
    Helper.testStatusForField(sut, 'password', errorMessage)
  })

  test('Should show valid password when validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateInput(sut, 'password', faker.internet.password())
    Helper.testStatusForField(sut, 'password')
  })

  test('Should show valid email when validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateInput(sut, 'email', faker.internet.email())
    Helper.testStatusForField(sut, 'password')
  })

  test('Should enable submit button when without errors', () => {
    const { sut } = makeSut()

    Helper.populateInput(sut, 'email', faker.internet.email())
    Helper.populateInput(sut, 'password', faker.internet.password())

    Helper.testButtonIsDisabled(sut, 'submit', false)
  })

  test('Should show spinner when form submit', async () => {
    const { sut } = makeSut()

    await simulateSubmit(sut, faker.internet.email(), faker.internet.password())

    Helper.testElementExists(sut, 'spinner')
  })

  test('Should call Authentication Service with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()

    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateSubmit(sut, email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('Should call authentication one time only', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateSubmit(sut)
    await simulateSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', async () => {
    const errorMessage = faker.random.words()
    const { sut, authenticationSpy } = makeSut(errorMessage)
    await simulateSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  /* async when test depends external call */
  test('Should show errorMessage if authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()

    const error = new InvalidCredentialsError()
    /* mock return */
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))

    await simulateSubmit(sut)

    Helper.testElementText(sut, 'error-message', error.message)
    /* confirm that the loading is hidden */
    Helper.testContainerChildCount(sut, 1, 'error-container')
  })

  test('Should show error when call UpdateCurrentAccount and throw exception', async () => {
    const { sut, updateCurrentAccountMock } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(updateCurrentAccountMock, 'save').mockReturnValueOnce(Promise.reject(error))
    await simulateSubmit(sut)
    Helper.testElementText(sut, 'error-container', error.message)
    Helper.testContainerChildCount(sut, 1, 'error-container')
  })

  test('Should call UpdateCurrentAccount on success', async () => {
    const { sut, authenticationSpy, updateCurrentAccountMock } = makeSut()
    await simulateSubmit(sut)
    expect(updateCurrentAccountMock.account).toEqual(authenticationSpy.account)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('Should redirect to signup page', () => {
    const { sut } = makeSut()
    const register = sut.getByTestId('signup')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})

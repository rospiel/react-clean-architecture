import React from 'react'
import 'jest-localstorage-mock'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { AuthenticationSpy, ValidationStub } from '@/presentation/test'
import faker from 'faker'
import { InvalidCredentialsError } from '@/domain/errors'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

const history = createMemoryHistory({ initialEntries: ['/login'] })
function makeSut (errorMessage?: string): SutTypes {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = errorMessage
  const sut = render(
    /* necessarily Router when the component uses link from react-router */
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>
  )
  return {
    sut,
    authenticationSpy
  }
}

function populateInput (sut: RenderResult, inputName: string, value: string): void {
  const input = sut.getByTestId(inputName)
  fireEvent.input(input, { target: { value: value } })
}

async function simulateSubmit (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> {
  populateInput(sut, 'email', email)
  populateInput(sut, 'password', password)

  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  /* because the call is async wait until finish, necessary pass a element that is always in the screen to listening  */
  await waitFor(() => form)
}

function testStatusForField (sut: RenderResult, fieldName: string, errorMessage?: string): void {
  const emailStatus = sut.getByTestId(fieldName.concat('-status'))
  expect(emailStatus.title).toBe(errorMessage || 'Tudo certo')
  expect(emailStatus.textContent).toBe(errorMessage ? '🔴' : '🟢')
}

function testContainerChildCount (sut: RenderResult, count: number, containerName: string): void {
  const container = sut.getByTestId(containerName)
  expect(container.childElementCount).toBe(count)
}

function testElementExists (sut: RenderResult, fieldName: string): void {
  const element = sut.getByTestId(fieldName)
  expect(element).toBeTruthy()
}

function testElementText (sut: RenderResult, fieldName: string, text: string): void {
  const element = sut.getByTestId(fieldName)
  expect(element.textContent).toBe(text)
}

function testButtonIsDisabled (sut: RenderResult, fieldName: string, isDisabled: boolean): void {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

describe('Login component', () => {
  afterEach(cleanup) /* clean after every test */

  beforeEach(() => {
    localStorage.clear()
  })

  test('Should initialize with some rules', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut(errorMessage)
    const errorWrap = sut.getByTestId('error-container')
    expect(errorWrap.childElementCount).toBe(0)

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)

    testContainerChildCount(sut, 0, 'error-container')
    testButtonIsDisabled(sut, 'submit', true)
    testStatusForField(sut, 'email', errorMessage)
    testStatusForField(sut, 'password', errorMessage)
  })

  test('Should show error message when email validation fails', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut(errorMessage)
    populateInput(sut, 'email', faker.internet.email())
    testStatusForField(sut, 'email', errorMessage)
  })

  test('Should show error message when password validation fails', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut(errorMessage)
    populateInput(sut, 'password', faker.internet.password())
    testStatusForField(sut, 'password', errorMessage)
  })

  test('Should show valid password when validation succeeds', () => {
    const { sut } = makeSut()
    populateInput(sut, 'password', faker.internet.password())
    testStatusForField(sut, 'password')
  })

  test('Should show valid email when validation succeeds', () => {
    const { sut } = makeSut()
    populateInput(sut, 'email', faker.internet.email())
    testStatusForField(sut, 'password')
  })

  test('Should enable submit button when without errors', () => {
    const { sut } = makeSut()

    populateInput(sut, 'email', faker.internet.email())
    populateInput(sut, 'password', faker.internet.password())

    testButtonIsDisabled(sut, 'submit', false)
  })

  test('Should show spinner when form submit', async () => {
    const { sut } = makeSut()

    await simulateSubmit(sut, faker.internet.email(), faker.internet.password())

    testElementExists(sut, 'spinner')
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

    testElementText(sut, 'error-message', error.message)
    /* confirm that the loading is hidden */
    testContainerChildCount(sut, 1, 'error-container')
  })

  test('Should add accessToken to localStorage on success', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateSubmit(sut)
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
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

import React from 'react'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import SignUp from './signup'
import { AddAccountSpy, Helper, SaveAccessTokenMock, ValidationStub } from '@/presentation/test'
import faker from 'faker'
import { EmailInUseError } from '@/domain/errors'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  error: string
}

const history = createMemoryHistory({ initialEntries: ['/signup'] })

function makeSut (props?: SutParams): SutTypes {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = props?.error
  const addAccountSpy = new AddAccountSpy()
  const saveAccessTokenMock = new SaveAccessTokenMock()
  const sut = render(
    <Router history={history}>
      <SignUp validation={validationStub} addAccount={addAccountSpy} saveAccessToken={saveAccessTokenMock} />
    </Router>
  )
  return {
    sut,
    addAccountSpy,
    saveAccessTokenMock
  }
}

function populateForm (sut: RenderResult): void {
  const password = faker.internet.password()
  Helper.populateInput(sut, 'email', faker.internet.email())
  Helper.populateInput(sut, 'password', password)
  Helper.populateInput(sut, 'name', faker.name.findName())
  Helper.populateInput(sut, 'passwordConfirmation', password)
}

async function simulateSubmit (sut: RenderResult): Promise<void> {
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('SignUp Component', () => {
  afterEach(cleanup)

  test('Should initialize with some rules', () => {
    const error = faker.random.words()
    const { sut } = makeSut({ error })
    Helper.testContainerChildCount(sut, 0, 'error-container')
    Helper.testButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut, 'name', error)
    Helper.testStatusForField(sut, 'email', error)
    Helper.testStatusForField(sut, 'password', error)
    Helper.testStatusForField(sut, 'passwordConfirmation', error)
  })

  test('Should show error message when name validation fails', () => {
    const error = faker.random.words()
    const { sut } = makeSut({ error })
    const fieldName = 'name'
    Helper.populateInput(sut, fieldName, faker.name.firstName())
    Helper.testStatusForField(sut, fieldName, error)
  })

  test('Should show error message when email validation fails', () => {
    const error = faker.random.words()
    const { sut } = makeSut({ error })
    const fieldName = 'email'
    Helper.populateInput(sut, fieldName, faker.name.firstName())
    Helper.testStatusForField(sut, fieldName, error)
  })

  test('Should show error message when password validation fails', () => {
    const error = faker.random.words()
    const { sut } = makeSut({ error })
    const fieldName = 'password'
    Helper.populateInput(sut, fieldName, faker.name.firstName())
    Helper.testStatusForField(sut, fieldName, error)
  })

  test('Should show error message when passwordConfirmation validation fails', () => {
    const error = faker.random.words()
    const { sut } = makeSut({ error })
    const fieldName = 'passwordConfirmation'
    Helper.populateInput(sut, fieldName, faker.name.firstName())
    Helper.testStatusForField(sut, fieldName, error)
  })

  test('Should show valid fields when validation succeeds', () => {
    const { sut } = makeSut()
    const fields = new Map<string, any>()
    fields.set('name', faker.name.findName())
    fields.set('email', faker.internet.email())
    const password = faker.internet.password()
    fields.set('password', password)
    fields.set('password', password)
    for (const [key, value] of fields) {
      Helper.populateInput(sut, key, value)
      Helper.testStatusForField(sut, key)
    }
  })

  test('Should enable submit button when without errors', () => {
    const { sut } = makeSut()
    populateForm(sut)
    Helper.testButtonIsDisabled(sut, 'submit', false)
  })

  test('Should show spinner when form submit', async () => {
    const { sut } = makeSut()
    populateForm(sut)
    await simulateSubmit(sut)
    Helper.testElementExists(sut, 'spinner')
  })

  test('Should call AddAccount Service with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    Helper.populateInput(sut, 'email', email)
    Helper.populateInput(sut, 'password', password)
    Helper.populateInput(sut, 'name', name)
    Helper.populateInput(sut, 'passwordConfirmation', password)
    await simulateSubmit(sut)

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('Should call AddAccount one time only', async () => {
    const { sut, addAccountSpy } = makeSut()
    await simulateSubmit(sut)
    await simulateSubmit(sut)
    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('Should not call AddAccount if form is invalid', async () => {
    const error = faker.random.words()
    const { sut, addAccountSpy } = makeSut({ error })
    await simulateSubmit(sut)
    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('Should show errorMessage if AddAccount fails', async () => {
    const { sut, addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)

    await simulateSubmit(sut)

    Helper.testElementText(sut, 'error-message', error.message)
    Helper.testContainerChildCount(sut, 1, 'error-container')
  })

  test('Should call SaveAccessToken on success', async () => {
    const { sut, addAccountSpy, saveAccessTokenMock } = makeSut()
    await simulateSubmit(sut)
    expect(saveAccessTokenMock.accessToken).toBe(addAccountSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('Should show error when call SaveAccessToken and throw exception', async () => {
    const { sut, saveAccessTokenMock } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(saveAccessTokenMock, 'save').mockRejectedValueOnce(error)
    await simulateSubmit(sut)
    Helper.testElementText(sut, 'error-container', error.message)
    Helper.testContainerChildCount(sut, 1, 'error-container')
  })

  test('Should redirect to signup page', () => {
    const { sut } = makeSut()
    const register = sut.getByTestId('signup')
    fireEvent.click(register)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/login')
  })
})

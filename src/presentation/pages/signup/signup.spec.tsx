import React from 'react'
import { cleanup, fireEvent, render, waitFor, screen } from '@testing-library/react'
import SignUp from './signup'
import { AddAccountSpy, Helper, ValidationStub } from '@/presentation/test'
import faker from 'faker'
import { EmailInUseError } from '@/domain/errors'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { AccountModel } from '@/domain/models'
import ApiContext from '@/presentation/contexts/api/api-context'

type SutTypes = {
  addAccountSpy: AddAccountSpy
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  error: string
}

const history = createMemoryHistory({ initialEntries: ['/signup'] })

function makeSut (props?: SutParams): SutTypes {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = props?.error
  const addAccountSpy = new AddAccountSpy()
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <SignUp validation={validationStub} addAccount={addAccountSpy} />
      </Router>
    </ApiContext.Provider>
  )
  return {
    addAccountSpy,
    setCurrentAccountMock
  }
}

function populateForm (): void {
  const password = faker.internet.password()
  Helper.populateInput('email', faker.internet.email())
  Helper.populateInput('password', password)
  Helper.populateInput('name', faker.name.findName())
  Helper.populateInput('passwordConfirmation', password)
}

async function simulateSubmit (): Promise<void> {
  const form = screen.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('SignUp Component', () => {
  afterEach(cleanup)

  test('Should initialize with some rules', () => {
    const error = faker.random.words()
    makeSut({ error })
    // Helper.testContainerChildCount(0, 'error-container')
    expect(screen.getByTestId('error-container').children).toHaveLength(0)
    // Helper.testButtonIsDisabled('submit', true)
    expect(screen.getByTestId('submit')).toBeDisabled()
    Helper.testStatusForField('name', error)
    Helper.testStatusForField('email', error)
    Helper.testStatusForField('password', error)
    Helper.testStatusForField('passwordConfirmation', error)
  })

  test('Should show error message when name validation fails', () => {
    const error = faker.random.words()
    makeSut({ error })
    const fieldName = 'name'
    Helper.populateInput(fieldName, faker.name.firstName())
    Helper.testStatusForField(fieldName, error)
  })

  test('Should show error message when email validation fails', () => {
    const error = faker.random.words()
    makeSut({ error })
    const fieldName = 'email'
    Helper.populateInput(fieldName, faker.name.firstName())
    Helper.testStatusForField(fieldName, error)
  })

  test('Should show error message when password validation fails', () => {
    const error = faker.random.words()
    makeSut({ error })
    const fieldName = 'password'
    Helper.populateInput(fieldName, faker.name.firstName())
    Helper.testStatusForField(fieldName, error)
  })

  test('Should show error message when passwordConfirmation validation fails', () => {
    const error = faker.random.words()
    makeSut({ error })
    const fieldName = 'passwordConfirmation'
    Helper.populateInput(fieldName, faker.name.firstName())
    Helper.testStatusForField(fieldName, error)
  })

  test('Should show valid fields when validation succeeds', () => {
    makeSut()
    const fields = new Map<string, any>()
    fields.set('name', faker.name.findName())
    fields.set('email', faker.internet.email())
    const password = faker.internet.password()
    fields.set('password', password)
    fields.set('password', password)
    for (const [key, value] of fields) {
      Helper.populateInput(key, value)
      Helper.testStatusForField(key)
    }
  })

  test('Should enable submit button when without errors', () => {
    makeSut()
    populateForm()
    // Helper.testButtonIsDisabled('submit', false)
    expect(screen.getByTestId('submit')).toBeEnabled()
  })

  test('Should show spinner when form submit', async () => {
    makeSut()
    populateForm()
    await simulateSubmit()
    // Helper.testElementExists('spinner')
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  test('Should call AddAccount Service with correct values', async () => {
    const { addAccountSpy } = makeSut()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    Helper.populateInput('email', email)
    Helper.populateInput('password', password)
    Helper.populateInput('name', name)
    Helper.populateInput('passwordConfirmation', password)
    await simulateSubmit()

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('Should call AddAccount one time only', async () => {
    const { addAccountSpy } = makeSut()
    await simulateSubmit()
    await simulateSubmit()
    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('Should not call AddAccount if form is invalid', async () => {
    const error = faker.random.words()
    const { addAccountSpy } = makeSut({ error })
    await simulateSubmit()
    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('Should show errorMessage if AddAccount fails', async () => {
    const { addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)

    await simulateSubmit()

    // Helper.testElementText('error-message', error.message)
    expect(screen.getByTestId('error-message')).toHaveTextContent(error.message)
    // Helper.testContainerChildCount(1, 'error-container')
    expect(screen.getByTestId('error-container').children).toHaveLength(1)
  })

  test('Should call SaveAccessToken on success', async () => {
    const { addAccountSpy, setCurrentAccountMock } = makeSut()
    await simulateSubmit()
    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('Should redirect to signup page', () => {
    makeSut()
    const register = screen.getByTestId('signup')
    fireEvent.click(register)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/login')
  })
})

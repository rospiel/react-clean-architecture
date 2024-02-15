import { EmailValidation, MinLengthValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import makeLoginValidation from './login-validation-factory'

describe('LoginValidationFactory', () => {
  test('Should make ValidationComposite with correct validations', () => {
    const composite = makeLoginValidation()
    const emailField = 'email'
    const passwordField = 'password'
    expect(composite).toEqual(ValidationComposite.build([
      new RequiredFieldValidation(emailField),
      new EmailValidation(emailField),
      new RequiredFieldValidation(passwordField),
      new MinLengthValidation(passwordField, 5)
    ]))
  })
})

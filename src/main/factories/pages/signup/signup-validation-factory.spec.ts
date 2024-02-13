import { EmailValidation, MinLengthValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeSignUpValidation } from './signup-validation-factory'
import { CompareFieldsValidation } from '@/validation/validators/compare-fields/compare-fields-validation'

describe('SignUpValidationFactory', function () {
  test('Should create ValidationComposite with correct validations', function () {
    const composite = makeSignUpValidation()
    const nameField = 'name'
    const emailField = 'email'
    const passwordField = 'password'
    const passwordConfirmationField = 'passwordConfirmation'
    expect(composite).toEqual(ValidationComposite.build([
      new RequiredFieldValidation(nameField),
      new MinLengthValidation(nameField, 5),
      new RequiredFieldValidation(emailField),
      new EmailValidation(emailField),
      new RequiredFieldValidation(passwordField),
      new MinLengthValidation(passwordField, 5),
      new RequiredFieldValidation(passwordConfirmationField),
      new CompareFieldsValidation(passwordConfirmationField, passwordField)
    ]))
  })
})

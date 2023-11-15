import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder } from '@/validation/validators/builder/validation-builder'
import { makeSignUpValidation } from './signup-validation-factory'

describe('SignUpValidationFactory', function () {
  test('Should create ValidationComposite with correct validations', function () {
    const composite = makeSignUpValidation()
    const passwordField = 'password'
    expect(composite).toEqual(ValidationComposite.build([
      ...ValidationBuilder.field('name').required().min(5).build(),
      ...ValidationBuilder.field('email').required().email().build(),
      ...ValidationBuilder.field(passwordField).required().min(5).build(),
      ...ValidationBuilder.field('passwordConfirmation').required().sameAs(passwordField).build()
    ]))
  })
})

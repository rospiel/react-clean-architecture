import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder } from '@/validation/validators/builder/validation-builder'

export function makeSignUpValidation (): ValidationComposite {
  const passwordField = 'password'
  return ValidationComposite.build([
    ...ValidationBuilder.field('name').required().min(5).build(),
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field(passwordField).required().min(5).build(),
    ...ValidationBuilder.field('passwordConfirmation').required().sameAs(passwordField).build()
  ])
}

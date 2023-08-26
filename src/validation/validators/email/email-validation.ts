import { FieldValidation } from '@/validation/protocols/field-validation'
import { InvalidFieldError } from '@/validation/errors'

export class EmailValidation implements FieldValidation {
  readonly EMAIL_REGEX = /[a-z0-9!#$%&' * +/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  constructor (readonly field: string) { }

  validate (value: string): Error {
    return (this.isEmpty(value) || this.EMAIL_REGEX.test(value)) ? null : new InvalidFieldError()
  }

  isEmpty (value: string): boolean {
    return !value
  }
}

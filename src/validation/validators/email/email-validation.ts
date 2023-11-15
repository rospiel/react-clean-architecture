import { FieldValidation } from '@/validation/protocols/field-validation'
import { InvalidFieldError } from '@/validation/errors'

export class EmailValidation implements FieldValidation {
  readonly EMAIL_REGEX = /[a-z0-9!#$%&' * +/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  constructor (readonly field: string) { }

  validate (input: object): Error {
    return (this.isEmpty(input[this.field]) || this.EMAIL_REGEX.test(input[this.field])) ? null : new InvalidFieldError()
  }

  isEmpty (value: string): boolean {
    return !value
  }
}

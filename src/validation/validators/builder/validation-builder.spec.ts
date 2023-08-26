import { RequiredFieldValidation, EmailValidation, MinLengthValidation } from '@/validation/validators'
import { ValidationBuilder as sut } from './validation-builder'
import faker from 'faker'

describe('ValidationBuilder', () => {
  test('Should return validation type RequiredFieldValidation', () => {
    const fieldName = faker.database.column()
    const validations = sut.field(fieldName).required().build()
    expect(validations).toEqual([new RequiredFieldValidation(fieldName)])
  })

  test('Should return validation type EmailValidation', () => {
    const fieldName = faker.database.column()
    const validations = sut.field(fieldName).email().build()
    expect(validations).toEqual([new EmailValidation(fieldName)])
  })

  test('Should return validation type MinLengthValidation', () => {
    const fieldName = faker.database.column()
    const valueLength = faker.random.number()
    const validations = sut.field(fieldName).min(valueLength).build()
    expect(validations).toEqual([new MinLengthValidation(fieldName, valueLength)])
  })

  test('Should return various validation types', () => {
    const fieldName = faker.database.column()
    const valueLength = faker.random.number()
    const validations = sut.field(fieldName).min(valueLength).email().required().build()
    expect(validations).toEqual([
      new MinLengthValidation(fieldName, valueLength),
      new EmailValidation(fieldName),
      new RequiredFieldValidation(fieldName)])
  })
})

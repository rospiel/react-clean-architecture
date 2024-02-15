import { RequiredFieldValidation, EmailValidation, MinLengthValidation } from '@/validation/validators'
import { ValidationBuilder as sut } from './validation-builder'
import faker from 'faker'
import { CompareFieldsValidation } from '../compare-fields/compare-fields-validation'

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

  test('Should return CompareFieldsValidation', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.column()
    const validations = sut.field(field).sameAs(fieldToCompare).build()
    expect(validations).toEqual([new CompareFieldsValidation(field, fieldToCompare)])
  })
})

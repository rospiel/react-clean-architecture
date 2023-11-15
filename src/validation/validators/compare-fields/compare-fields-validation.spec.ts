import { CompareFieldsValidation } from './compare-fields-validation'
import faker from 'faker'
import { InvalidFieldError } from '@/validation/errors'

function makeSut (field: string, fieldToCompare: string): CompareFieldsValidation {
  return new CompareFieldsValidation(field, fieldToCompare)
}

describe('CompareFieldsValidation', () => {
  test('Should return InvalidFieldError when compares failed', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.column()
    const sut = makeSut(field, fieldToCompare)
    const error = sut.validate({
      [field]: faker.random.word(),
      [fieldToCompare]: faker.random.word()
    })
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return null when compares succeed', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.column()
    const sut = makeSut(field, fieldToCompare)
    const value = faker.random.word()
    const error = sut.validate({
      [field]: value,
      [fieldToCompare]: value
    })
    expect(error).toBeNull()
  })
})

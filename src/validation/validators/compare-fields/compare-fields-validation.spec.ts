import { CompareFieldsValidation } from './compare-fields-validation'
import { faker } from '@faker-js/faker'
import { InvalidFieldError } from '@/validation/errors'

function makeSut (field: string, fieldToCompare: string): CompareFieldsValidation {
  return new CompareFieldsValidation(field, fieldToCompare)
}

describe('CompareFieldsValidation', () => {
  test('Should return InvalidFieldError when compares failed', () => {
    const field = 'field'
    const fieldToCompare = 'other_field'
    const sut = makeSut(field, fieldToCompare)
    const error = sut.validate({
      [field]: faker.word.words(10),
      [fieldToCompare]: faker.word.words(5)
    })
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return null when compares succeed', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.column()
    const sut = makeSut(field, fieldToCompare)
    const value = faker.word.words()
    const error = sut.validate({
      [field]: value,
      [fieldToCompare]: value
    })
    expect(error).toBeNull()
  })
})

import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from './min-length-validation'
import { faker } from '@faker-js/faker'

const makeSut = (field: string): MinLengthValidation => new MinLengthValidation(field, 5)

describe('MinLengthValidation', () => {
  test('Should return error when value is less than the minimum', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.word.adjective(4)})
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should not return error when length pass', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.word.words(5) })
    expect(error).toBeFalsy()
  })

  test('Should not return error when not found field on object', () => {
    const sut = makeSut('field')
    const error = sut.validate({ [faker.database.column()]: faker.word.words(5) })
    expect(error).toBeFalsy()
  })
})

import { FieldValidationSpy } from '@/validation/test'
import { ValidationComposite } from './validation-composite'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: ValidationComposite
  listFieldValidationSpy: FieldValidationSpy[]
}

function makeSut (fieldName: string): SutTypes {
  const fieldValidationSpy = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName)
  ]

  const sut = ValidationComposite.build(fieldValidationSpy)
  return { sut, listFieldValidationSpy: fieldValidationSpy }
}

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const fieldName = faker.database.column()
    const { sut, listFieldValidationSpy } = makeSut(fieldName)
    const errorMessage = faker.word.words()
    listFieldValidationSpy[0].error = new Error(errorMessage)
    listFieldValidationSpy[1].error = new Error(faker.word.words())

    const error = sut.validate(fieldName, { [fieldName]: faker.word.adjective() })
    expect(error).toBe(error)
  })

  test('Should not return error when value success validated', () => {
    const fieldName = faker.database.column()
    const { sut } = makeSut(fieldName)

    const error = sut.validate(fieldName, { [fieldName]: faker.word.adjective() })
    expect(error).toBeFalsy()
  })
})

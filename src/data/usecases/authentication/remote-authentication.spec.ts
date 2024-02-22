
import { HttpPostClientSpy } from '@/data/test'
import { RemoteAuthentication } from './remote-authentication'
import { faker } from '@faker-js/faker'
import { mockAccountModel, mockAuthentication } from '@/domain/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy<AccountModel>
}

function makeSut (url: string = faker.internet.url(), statusCode: HttpStatusCode = HttpStatusCode.ok): SutTypes {
  const httpPostClientSpy = new HttpPostClientSpy<AccountModel>()
  httpPostClientSpy.response = { statusCode }
  const sut = new RemoteAuthentication(url, httpPostClientSpy)
  return {
    sut, httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('should call httpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url, HttpStatusCode.ok)
    await sut.auth(mockAuthentication())
    expect(httpPostClientSpy.url).toBe(url)/* compares heap space */
  })

  test('should call httpPostClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const authenticationParams = mockAuthentication()
    await sut.auth(authenticationParams)
    expect(httpPostClientSpy.body).toEqual(authenticationParams)/* compares object properties */
  })

  test('should throw InvalidCredentialsError if HttpPostClient returns HTTP 401', async () => {
    const { sut } = makeSut(faker.internet.url(), HttpStatusCode.unauthorized)
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('should throw UnexpectedError if HttpPostClient returns HTTP 400', async () => {
    const { sut } = makeSut(faker.internet.url(), HttpStatusCode.badRequest)
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpPostClient returns HTTP 500', async () => {
    const { sut } = makeSut(faker.internet.url(), HttpStatusCode.serverError)
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpPostClient returns HTTP 404', async () => {
    const { sut } = makeSut(faker.internet.url(), HttpStatusCode.notFound)
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should return an AccountModel if HttpPostClient returns HTTP 200', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const httpResult = mockAccountModel()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }

    const accountModel = await sut.auth(mockAuthentication())
    expect(accountModel).toEqual(httpResult)
  })
})

import { HttpPostClientSpy } from '@/data/test'
import { AccountModel } from '@/domain/models'
import { RemoteAddAccount } from './remote-add-account'
import { faker } from '@faker-js/faker'
import { mockAccountModel, mockAddAccountParams } from '@/domain/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { EmailInUseError, UnexpectedError } from '@/domain/errors'

type SutTypes = {
  sut: RemoteAddAccount
  httpPostClientSpy: HttpPostClientSpy<AccountModel>
}

function makeSut (url: string = faker.internet.url()): SutTypes {
  const httpPostClientSpy = new HttpPostClientSpy<AccountModel>()
  const sut = new RemoteAddAccount(url, httpPostClientSpy)

  return {
    sut, httpPostClientSpy
  }
}

describe('RemoteAddAccount', () => {
  test('Should call httpPostClient with correct address and body', async () => {
    const url = faker.internet.url()
    const body = mockAddAccountParams()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.add(body)
    expect(httpPostClientSpy.url).toBe(url)
    expect(httpPostClientSpy.body).toEqual(body)
  })

  test('Should throw EmailInUseError when HttpPostClient returns http code 403', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new EmailInUseError())
  })

  test('Should throw UnexpectedError when HttpPostClient returns http code 400', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError when HttpPostClient returns http code 500', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError when HttpPostClient returns http code 404', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return AccountModel when HttpPostClient returns http code 200', async () => {
    const responseBody = mockAccountModel()
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: responseBody
    }
    const accountModel = await sut.add(mockAddAccountParams())
    expect(accountModel).toEqual(responseBody)
  })
})

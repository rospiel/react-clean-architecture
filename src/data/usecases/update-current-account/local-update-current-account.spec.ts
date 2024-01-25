import { SetStorageMock } from '@/data/test/mock-cache'
import { LocalUpdateCurrentAccount } from './local-update-current-account'
import { UnexpectedError } from '@/domain/errors'
import { mockAccountModel } from '@/domain/test'

type SutTypes = {
  sut: LocalUpdateCurrentAccount
  setStorageMock: SetStorageMock
}

function makeSut (): SutTypes {
  const setStorageMock = new SetStorageMock()
  return {
    sut: new LocalUpdateCurrentAccount(setStorageMock),
    setStorageMock: setStorageMock
  }
}

describe('LocalUpdateCurrentAccount', () => {
  test('Should call SetStorage passing properties', async () => {
    const { sut, setStorageMock } = makeSut()
    const account = mockAccountModel()
    await sut.save(account)
    expect(setStorageMock.key).toBe('account')
    expect(setStorageMock.value).toBe(JSON.stringify(account))
  })

  test('Should throw when SetStorage throws', async () => {
    const { sut, setStorageMock } = makeSut()
    const error = new Error()
    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(error)
    const result = sut.save(mockAccountModel())
    await expect(result).rejects.toThrow(error)
  })

  test('Should throw UnexpectedError when accessToken empty', async () => {
    const { sut, setStorageMock } = makeSut()
    const result = sut.save(undefined)
    await expect(result).rejects.toThrow(new UnexpectedError())
  })
})

import { SetStorageMock } from '@/data/test/mock-cache'
import { LocalSaveAccessToken } from './local-save-access-token'
import faker from 'faker'

type SutTypes = {
  sut: LocalSaveAccessToken
  setStorageMock: SetStorageMock
}

function makeSut (): SutTypes {
  const setStorageMock = new SetStorageMock()
  return {
    sut: new LocalSaveAccessToken(setStorageMock),
    setStorageMock: setStorageMock
  }
}

describe('LocalSaveAccessToken', () => {
  test('Should call SetStorage passing properties', async () => {
    const { sut, setStorageMock } = makeSut()
    const accessToken = faker.random.uuid()
    await sut.save(accessToken)
    expect(setStorageMock.key).toBe('accessToken')
    expect(setStorageMock.value).toBe(accessToken)
  })

  test('Should throw when SetStorage throws', async () => {
    const { sut, setStorageMock } = makeSut()
    const error = new Error()
    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(error)
    const accessToken = faker.random.uuid()
    const result = sut.save(accessToken)
    await expect(result).rejects.toThrow(error)
  })
})

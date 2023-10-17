import faker, { fake } from 'faker'
import 'jest-localstorage-mock'
import { LocalStorageAdapter } from './local-storage-adapter'

function makeSut (): LocalStorageAdapter {
  return new LocalStorageAdapter()
}

describe('LocalStorageAdapter', () => {
  beforeEach(function cleanLocalStorage() {
    localStorage.clear()
  })
  
  test('Should save key and value in localStorage', async () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = faker.random.word()
    await sut.set(key, value)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, value)
  })
})
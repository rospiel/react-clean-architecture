import faker, { fake } from 'faker'
import 'jest-localstorage-mock'
import { LocalStorageAdapter } from './local-storage-adapter'
import { AccountModel } from '@/domain/models'

function makeSut (): LocalStorageAdapter {
  return new LocalStorageAdapter()
}

describe('LocalStorageAdapter', () => {
  beforeEach(function cleanLocalStorage() {
    localStorage.clear()
  })
  
  test('Should save key and value in localStorage', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = faker.random.objectElement<AccountModel>()
    sut.set(key, value)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value))
  })

  test('Should get value with key from localStorage', function () {
    const sut = makeSut()
    const key = faker.database.column()        
    const value = faker.random.objectElement<AccountModel>()
    const getItemSpy = jest.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify(value))
    const response = sut.get(key)

    expect(response).toEqual(value)
    expect(getItemSpy).toHaveBeenCalledWith(key)
  })
})
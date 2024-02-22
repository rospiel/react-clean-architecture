import { faker } from '@faker-js/faker'
import 'jest-localstorage-mock'
import { LocalStorageAdapter } from './local-storage-adapter'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'

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
    const accountModel = mockAccountModel()
    sut.set(key, accountModel)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(accountModel))
  })

  test('Should remove key when value is undefined', () => {
    const sut = makeSut()
    const key = faker.database.column()
    
    sut.set(key, undefined)
    expect(localStorage.removeItem).toHaveBeenCalledWith(key)
  })

  test('Should remove key when value is null', () => {
    const sut = makeSut()
    const key = faker.database.column()
    
    sut.set(key, null)
    expect(localStorage.removeItem).toHaveBeenCalledWith(key)
  })

  test('Should get value with key from localStorage', function () {
    const sut = makeSut()
    const key = faker.database.column()      
    const accountModel = mockAccountModel()
    const getItemSpy = jest.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify(accountModel))
    const response = sut.get(key)

    expect(response).toEqual(accountModel)
    expect(getItemSpy).toHaveBeenCalledWith(key)
  })
})
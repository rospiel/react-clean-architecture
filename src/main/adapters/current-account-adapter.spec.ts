import { mockAccountModel } from "@/domain/test"
import { LocalStorageAdapter } from "@/infra/cache/local-storage-adapter"
import setCurrentAccountAdapter, { getCurrentAccountAdapter } from "./current-account-adapter"
import { UnexpectedError } from "@/domain/errors"

jest.mock('@/infra/cache/local-storage-adapter')

describe('CurrentAccountAdapter', function () {
    test('Should call setItem with correct value', function () {
        const account = mockAccountModel()
        const setSpy = jest.spyOn(LocalStorageAdapter.prototype, 'set')
        setCurrentAccountAdapter(account)
        expect(setSpy).toHaveBeenCalledWith('account', account)
    })

    test('Should throw UnexpectedError when AccountModel is undefined', function () {
        expect(function () {
            setCurrentAccountAdapter(undefined)
        }).toThrow(new UnexpectedError())
    })

    test('Should throw UnexpectedError when AccountModel is without accessToken', function () {
        const account = mockAccountModel()
        account.accessToken = undefined
        
        expect(function () {
            setCurrentAccountAdapter(account)
        }).toThrow(new UnexpectedError())
    })

    test('Should call getItem with correct value', function () {
        const account = mockAccountModel()
        const getSpy = jest.spyOn(LocalStorageAdapter.prototype, 'get').mockReturnValueOnce(account)
        const response = getCurrentAccountAdapter()
        expect(getSpy).toHaveBeenCalledWith('account')
        expect(response).toEqual(account)
    })
})
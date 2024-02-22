import { GetStorageSpy, HttpGetClientSpy, mockGetRequest } from "@/data/test"
import { AuthorizeHttpGetClientDecorator } from "./authorize-http-get-client-decorator"
import { HttpGetParams } from "@/data/protocols/http"
import { faker } from '@faker-js/faker'
import { mockAccountModel } from "@/domain/test"

type SutTypes = {
    sut: AuthorizeHttpGetClientDecorator
    getStorageSpy: GetStorageSpy
    httpGetClientSpy: HttpGetClientSpy
}

function makeSut (): SutTypes {
    const getStorageSpy = new GetStorageSpy()
    const httpGetClientSpy = new HttpGetClientSpy()
    return {
        sut: new AuthorizeHttpGetClientDecorator(getStorageSpy, httpGetClientSpy),
        getStorageSpy, 
        httpGetClientSpy
    }
}
 
describe('AuthorizeHttpGetClientDecorator', function () {
    test('Should call getStorage with parameter received', async function () {
        const { getStorageSpy, sut } = makeSut()
        sut.get(mockGetRequest())
        expect(getStorageSpy.key).toBe('account')
    })

    test('Should not add headers if getStorage is invalid when searching for the property', async function () {
        const { httpGetClientSpy, sut } = makeSut()
        const request: HttpGetParams = {
            url: faker.internet.url(), 
            headers: {
                field: faker.word.words()
            }
        }
        await sut.get(request)
        expect(httpGetClientSpy.url).toBe(request.url)
        expect(httpGetClientSpy.headers).toEqual(request.headers)
    })

    test('Should add headers to httpGetClient', async function () {
        const { httpGetClientSpy, sut, getStorageSpy } = makeSut()
        getStorageSpy.value = mockAccountModel()
        const request: HttpGetParams = {
            url: faker.internet.url()
        }
        await sut.get(request)
        expect(httpGetClientSpy.url).toBe(request.url)
        expect(httpGetClientSpy.headers).toEqual({
            'x-access-token': getStorageSpy.value.accessToken
        })
    })

    test('Should merge headers to httpGetClient', async function () {
        const { httpGetClientSpy, sut, getStorageSpy } = makeSut()
        getStorageSpy.value = mockAccountModel()
        const field = faker.word.words()
        const request: HttpGetParams = {
            url: faker.internet.url(), 
            headers: { field }
        }
        await sut.get(request)
        expect(httpGetClientSpy.url).toBe(request.url)
        expect(httpGetClientSpy.headers).toEqual({
            field,
            'x-access-token': getStorageSpy.value.accessToken
        })
    })

    test('Should  httpGetClient', async function () {
        const { httpGetClientSpy, sut } = makeSut()
        const response = await sut.get(mockGetRequest())
        expect(response).toEqual(httpGetClientSpy.response)
    })
})
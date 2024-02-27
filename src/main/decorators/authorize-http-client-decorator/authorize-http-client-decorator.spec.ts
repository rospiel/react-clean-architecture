import { GetStorageSpy, HttpClientSpy, mockHttpRequest } from "@/data/test"
import { AuthorizeHttpClientDecorator } from "./authorize-http-client-decorator"
import { HttpRequest } from "@/data/protocols/http"
import { faker } from '@faker-js/faker'
import { mockAccountModel } from "@/domain/test"
import { HttpMethod } from "@/domain/enums"

type SutTypes = {
    sut: AuthorizeHttpClientDecorator
    getStorageSpy: GetStorageSpy
    httpClientSpy: HttpClientSpy
}

function makeSut (): SutTypes {
    const getStorageSpy = new GetStorageSpy()
    const httpClientSpy = new HttpClientSpy()
    return {
        sut: new AuthorizeHttpClientDecorator(getStorageSpy, httpClientSpy),
        getStorageSpy, 
        httpClientSpy: httpClientSpy
    }
}
 
describe('AuthorizeHttpClientDecorator', function () {
    test('Should call getStorage with parameter received', async function () {
        const { getStorageSpy, sut } = makeSut()
        sut.request(mockHttpRequest())
        expect(getStorageSpy.key).toBe('account')
    })

    test('Should not add headers if getStorage is invalid when searching for the property', async function () {
        const { httpClientSpy: httpGetClientSpy, sut } = makeSut()
        const request: HttpRequest = {
            url: faker.internet.url(), 
            headers: {
                field: faker.word.words()
            },
            method: faker.helpers.enumValue(HttpMethod),
        }
        await sut.request(request)
        expect(httpGetClientSpy.url).toBe(request.url)
        expect(httpGetClientSpy.headers).toEqual(request.headers)
    })

    test('Should add headers to httpGetClient', async function () {
        const { httpClientSpy: httpGetClientSpy, sut, getStorageSpy } = makeSut()
        getStorageSpy.value = mockAccountModel()
        const request: HttpRequest = {
            url: faker.internet.url(), 
            method: faker.helpers.enumValue(HttpMethod),
        }
        await sut.request(request)
        expect(httpGetClientSpy.url).toBe(request.url)
        expect(httpGetClientSpy.headers).toEqual({
            'x-access-token': getStorageSpy.value.accessToken
        })
    })

    test('Should merge headers to httpGetClient', async function () {
        const { httpClientSpy: httpGetClientSpy, sut, getStorageSpy } = makeSut()
        getStorageSpy.value = mockAccountModel()
        const field = faker.word.words()
        const request: HttpRequest = {
            url: faker.internet.url(), 
            headers: { field },
            method: faker.helpers.enumValue(HttpMethod),
        }
        await sut.request(request)
        expect(httpGetClientSpy.url).toBe(request.url)
        expect(httpGetClientSpy.headers).toEqual({
            field,
            'x-access-token': getStorageSpy.value.accessToken
        })
    })

    test('Should  httpGetClient', async function () {
        const { httpClientSpy: httpGetClientSpy, sut } = makeSut()
        const response = await sut.request(mockHttpRequest())
        expect(response).toEqual(httpGetClientSpy.response)
    })
})
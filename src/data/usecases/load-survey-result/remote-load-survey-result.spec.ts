import { faker } from '@faker-js/faker'
import { LoadSurveyResultModel, SurveyModel } from '@/domain/models'
import { HttpStatusCode } from '@/domain/enums/index'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { RemoteLoadSurveyResult } from './remote-load-survey-result'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { HttpClientSpy } from '@/data/test'

type SutTypes = {
    remoteLoadSurveyResult: RemoteLoadSurveyResult
    httpClientSpy: HttpClientSpy<LoadSurveyResultModel>
}

function makeSut (url: string = faker.internet.url()): SutTypes {
    const httpClientSpy = new HttpClientSpy<LoadSurveyResultModel>()
    return {
        remoteLoadSurveyResult: new RemoteLoadSurveyResult(url, httpClientSpy),
        httpClientSpy
    }
}

describe('RemoteLoadSurveyResult', function () {
    test('Should call HttpGetClient with correct address', async function () {
        const id = faker.string.alphanumeric()
        const url = faker.internet.url().concat('/{id}/')
        const body = mockSurveyResultModel()
        const sut = makeSut(url)
        sut.httpClientSpy.response = {
            statusCode: HttpStatusCode.ok,
            body
        }
        await sut.remoteLoadSurveyResult.load(id)
        expect(sut.httpClientSpy.url).toBe(url.replace('{id}', id))
    })

    test('Should throw AccessDeniedError when returns http code 403', async function () {
        const url = faker.internet.url()
        const sut = makeSut(url)
        sut.httpClientSpy.response = {
            statusCode: HttpStatusCode.forbidden
        }
        const promise = sut.remoteLoadSurveyResult.load(faker.string.alphanumeric())
        await expect(promise).rejects.toThrow(new AccessDeniedError())
    })

    test('Should throw UnexpectedError when returns http code 404', async function () {
        const url = faker.internet.url()
        const sut = makeSut(url)
        sut.httpClientSpy.response = {
            statusCode: HttpStatusCode.notFound
        }
        const promise = sut.remoteLoadSurveyResult.load(faker.string.alphanumeric())
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })

    test('Should throw UnexpectedError when returns http code 500', async function () {
        const url = faker.internet.url()
        const sut = makeSut(url)
        sut.httpClientSpy.response = {
            statusCode: HttpStatusCode.serverError
        }
        const promise = sut.remoteLoadSurveyResult.load(faker.string.alphanumeric())
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })

    test('Should return an array of SurveyModels when returns http code 200', async function () {
        const url = faker.internet.url()
        const body = mockSurveyResultModel()
        const sut = makeSut(url)
        sut.httpClientSpy.response = {
            statusCode: HttpStatusCode.ok,
            body
        }
        const surveyModels = await sut.remoteLoadSurveyResult.load(faker.string.alphanumeric())
        expect(surveyModels).toEqual(body)
    })

    test('Should return empty object of SurveyResultModel when returns http code 204', async function () {
        const url = faker.internet.url()
        const sut = makeSut(url)
        sut.httpClientSpy.response = {
            statusCode: HttpStatusCode.noContent
        }
        const surveyModels = await sut.remoteLoadSurveyResult.load(faker.string.alphanumeric())
        expect(surveyModels).toEqual({} as LoadSurveyResultModel)
    })
})
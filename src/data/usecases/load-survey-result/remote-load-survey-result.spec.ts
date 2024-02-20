import { HttpGetClientSpy } from '@/data/test'
import faker from 'faker'
import { LoadSurveyResultModel, SurveyModel } from '@/domain/models'
import { HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { RemoteLoadSurveyResult } from './remote-load-survey-result'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'

type SutTypes = {
    remoteLoadSurveyResult: RemoteLoadSurveyResult
    httpGetClientSpy: HttpGetClientSpy<LoadSurveyResultModel>
}

function makeSut (url: string = faker.internet.url()): SutTypes {
    const httpGetClientSpy = new HttpGetClientSpy<LoadSurveyResultModel>()
    return {
        remoteLoadSurveyResult: new RemoteLoadSurveyResult(url, httpGetClientSpy),
        httpGetClientSpy
    }
}

describe('RemoteLoadSurveyResult', function () {
    test('Should call HttpGetClient with correct address', async function () {
        const url = faker.internet.url()
        const body = mockSurveyResultModel()
        const sut = makeSut(url)
        sut.httpGetClientSpy.response = {
            statusCode: HttpStatusCode.ok,
            body
        }
        await sut.remoteLoadSurveyResult.load()
        expect(sut.httpGetClientSpy.url).toBe(url)
    })

    test('Should throw AccessDeniedError when returns http code 403', async function () {
        const url = faker.internet.url()
        const sut = makeSut(url)
        sut.httpGetClientSpy.response = {
            statusCode: HttpStatusCode.forbidden
        }
        const promise = sut.remoteLoadSurveyResult.load()
        await expect(promise).rejects.toThrow(new AccessDeniedError())
    })

    test('Should throw UnexpectedError when returns http code 404', async function () {
        const url = faker.internet.url()
        const sut = makeSut(url)
        sut.httpGetClientSpy.response = {
            statusCode: HttpStatusCode.notFound
        }
        const promise = sut.remoteLoadSurveyResult.load()
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })

    test('Should throw UnexpectedError when returns http code 500', async function () {
        const url = faker.internet.url()
        const sut = makeSut(url)
        sut.httpGetClientSpy.response = {
            statusCode: HttpStatusCode.serverError
        }
        const promise = sut.remoteLoadSurveyResult.load()
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })

    test('Should return an array of SurveyModels when returns http code 200', async function () {
        const url = faker.internet.url()
        const body = mockSurveyResultModel()
        const sut = makeSut(url)
        sut.httpGetClientSpy.response = {
            statusCode: HttpStatusCode.ok,
            body
        }
        const surveyModels = await sut.remoteLoadSurveyResult.load()
        expect(surveyModels).toEqual(body)
    })

    test('Should return empty object of SurveyResultModel when returns http code 204', async function () {
        const url = faker.internet.url()
        const sut = makeSut(url)
        sut.httpGetClientSpy.response = {
            statusCode: HttpStatusCode.noContent
        }
        const surveyModels = await sut.remoteLoadSurveyResult.load()
        expect(surveyModels).toEqual({} as LoadSurveyResultModel)
    })
})
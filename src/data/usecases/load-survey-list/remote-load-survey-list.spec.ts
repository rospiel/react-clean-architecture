import { HttpClientSpy } from '@/data/test'
import { faker } from '@faker-js/faker'
import { RemoteLoadSurveyList } from './remote-load-survey-list'
import { SurveyModel } from '@/domain/models'
import { HttpStatusCode } from '@/domain/enums/index'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { mockSurveyListModel } from '@/domain/test'

type SutTypes = {
    remoteLoadSurveyList: RemoteLoadSurveyList
    httpClientSpy: HttpClientSpy<SurveyModel[]>
}

function makeSut(url: string = faker.internet.url()): SutTypes {
    const httpClientSpy = new HttpClientSpy<SurveyModel[]>()
    return {
        remoteLoadSurveyList: new RemoteLoadSurveyList(url, httpClientSpy),
        httpClientSpy: httpClientSpy
    }
}

describe('RemoteLoadSurveyList', function () {
    test('Should call HttpGetClient with correct address', async function () {
        const url = faker.internet.url()
        const body = mockSurveyListModel()
        const sut = makeSut(url)
        sut.httpClientSpy.response = {
            statusCode: HttpStatusCode.ok,
            body
        }
        await sut.remoteLoadSurveyList.all()
        expect(sut.httpClientSpy.url).toBe(url)
    })

    test('Should throw AccessDeniedError when returns http code 403', async function () {
        const url = faker.internet.url()
        const sut = makeSut(url)
        sut.httpClientSpy.response = {
            statusCode: HttpStatusCode.forbidden
        }
        const promise = sut.remoteLoadSurveyList.all()
        await expect(promise).rejects.toThrow(new AccessDeniedError())
    })

    test('Should throw UnexpectedError when returns http code 404', async function () {
        const url = faker.internet.url()
        const sut = makeSut(url)
        sut.httpClientSpy.response = {
            statusCode: HttpStatusCode.notFound
        }
        const promise = sut.remoteLoadSurveyList.all()
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })

    test('Should throw UnexpectedError when returns http code 500', async function () {
        const url = faker.internet.url()
        const sut = makeSut(url)
        sut.httpClientSpy.response = {
            statusCode: HttpStatusCode.serverError
        }
        const promise = sut.remoteLoadSurveyList.all()
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })

    test('Should return an array of SurveyModels when returns http code 200', async function () {
        const url = faker.internet.url()
        const body = mockSurveyListModel()
        const sut = makeSut(url)
        sut.httpClientSpy.response = {
            statusCode: HttpStatusCode.ok,
            body
        }
        const surveyModels = await sut.remoteLoadSurveyList.all()
        expect(surveyModels).toEqual(body)
    })

    test('Should return empty array of SurveyModels when returns http code 204', async function () {
        const url = faker.internet.url()
        const sut = makeSut(url)
        sut.httpClientSpy.response = {
            statusCode: HttpStatusCode.noContent
        }
        const surveyModels = await sut.remoteLoadSurveyList.all()
        expect(surveyModels).toEqual([])
    })
})
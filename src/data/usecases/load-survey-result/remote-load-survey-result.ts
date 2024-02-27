import HttpClient from '@/data/protocols/http/http-client'
import { HttpMethod, HttpStatusCode } from '@/domain/enums/index'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { LoadSurveyResultModel, SurveyModel } from '@/domain/models'
import { LoadSurveyResult } from '@/domain/usecases'

export class RemoteLoadSurveyResult implements LoadSurveyResult {
    constructor (
        private readonly url: string, 
        private readonly httpClient: HttpClient<LoadSurveyResultModel>
    ) {}

    async load (id: string): Promise<LoadSurveyResultModel> {
        const response = await this.httpClient.request({
            url: this.url.replace('{id}', id), 
            method: HttpMethod.GET
        })
        
        switch (response.statusCode) {
            case HttpStatusCode.ok: return Object.assign({}, response.body, {date: new Date(response.body.date)})
            case HttpStatusCode.noContent: return {} as LoadSurveyResultModel
            case HttpStatusCode.forbidden: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }
}
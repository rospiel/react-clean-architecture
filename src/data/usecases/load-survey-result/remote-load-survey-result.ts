import { HttpGetClient, HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { LoadSurveyResultModel, SurveyModel } from '@/domain/models'
import { LoadSurveyResult } from '@/domain/usecases'

export class RemoteLoadSurveyResult implements LoadSurveyResult {
    constructor (
        private readonly url: string, 
        private readonly httpGetClient: HttpGetClient<LoadSurveyResultModel>
    ) {}

    async load (id: string): Promise<LoadSurveyResultModel> {
        const response = await this.httpGetClient.get({
            url: this.url.replace('{id}', id)
        })
        
        switch (response.statusCode) {
            case HttpStatusCode.ok: return Object.assign({}, response.body, {date: new Date(response.body.date)})
            case HttpStatusCode.noContent: return {} as LoadSurveyResultModel
            case HttpStatusCode.forbidden: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }
}
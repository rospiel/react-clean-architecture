import HttpClient from '@/data/protocols/http/http-client'
import { HttpMethod, HttpStatusCode } from '@/domain/enums/index'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { SurveyModel } from '@/domain/models'
import { LoadSurveyList } from '@/domain/usecases/load-survey-list'

export class RemoteLoadSurveyList implements LoadSurveyList {
    constructor (
        private readonly url: string, 
        private readonly httpClient: HttpClient<SurveyModel[]>
    ) {}

    async all (): Promise<SurveyModel[]> {
        const response = await this.httpClient.request({
            url: this.url, 
            method: HttpMethod.GET
        })
        
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body.map(value => Object.assign(value, { date: new Date(value.date)}))
            case HttpStatusCode.noContent: return []
            case HttpStatusCode.forbidden: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }
}
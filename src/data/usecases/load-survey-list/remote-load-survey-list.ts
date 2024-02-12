import { HttpGetClient, HttpStatusCode } from '@/data/protocols/http'
import { UnexpectedError } from '@/domain/errors'
import { SurveyModel } from '@/domain/models'
import { LoadSurveyList } from '@/domain/usecases/load-survey-list'

export class RemoteLoadSurveyList implements LoadSurveyList {
    constructor (
        private readonly url: string, 
        private readonly httpGetClient: HttpGetClient<SurveyModel[]>
    ) {}

    async all (): Promise<SurveyModel[]> {
        const response = await this.httpGetClient.get({
            url: this.url
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return []
            default: throw new UnexpectedError()
        }
    }

    private convertStringToDate (date: string): Date {
        return new Date(date)
    }
}
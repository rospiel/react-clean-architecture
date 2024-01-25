import { HttpResponse } from '.'

export type HttpGetParams = {
    url: string
}

export interface HttpGetClient<T = any> {
    get: (params: HttpGetParams) => Promise<HttpResponse<T>>
}
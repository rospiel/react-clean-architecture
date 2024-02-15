import { HttpResponse } from '.'

export type HttpGetParams = {
    url: string
    headers?: any
}

export interface HttpGetClient<T = any> {
    get: (params: HttpGetParams) => Promise<HttpResponse<T>>
}
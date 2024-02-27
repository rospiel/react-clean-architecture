import { HttpMethod, HttpStatusCode } from "@/domain/enums"

export type HttpRequest = {
    url: string
    method: HttpMethod
    body?: any
    headers?: any
}

export type HttpResponse<T = any> = {
    statusCode: HttpStatusCode
    body?: T
}

export default interface HttpClient<R = any> {
    request: (data: HttpRequest) => Promise<HttpResponse<R>>
}
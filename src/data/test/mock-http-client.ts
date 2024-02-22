import { HttpPostClient, HttpPostClientParams, HttpResponse, HttpStatusCode, HttpGetParams, HttpGetClient } from '@/data/protocols/http'
import { faker } from '@faker-js/faker'

export const mockPostRequest = (): HttpPostClientParams => ({
  url: faker.internet.url(),
  body: faker.person.fullName()
})

export function mockGetRequest (): HttpGetParams {
  return {
    url: faker.internet.url(),
    headers: faker.person.fullName()
  }
} 

export class HttpPostClientSpy<R = any> implements HttpPostClient<R> {
  url?: string
  body?: any
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok
  }

  async post (params: HttpPostClientParams): Promise<HttpResponse<R>> {
    this.url = params.url
    this.body = params.body
    return this.response
  }
}

export class HttpGetClientSpy<T = any> implements HttpGetClient<T> {
  url: string
  headers?: any
  response: HttpResponse<T> = {
    statusCode: HttpStatusCode.ok
  }

  async get (params: HttpGetParams): Promise<HttpResponse<T>> {
    this.url = params.url
    this.headers = params.headers
    return this.response
  }
}

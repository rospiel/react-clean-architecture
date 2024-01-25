import { HttpPostClient, HttpPostClientParams, HttpResponse, HttpStatusCode, HttpGetParams, HttpGetClient } from '@/data/protocols/http'
import faker from 'faker'

export const mockPostRequest = (): HttpPostClientParams => ({
  url: faker.internet.url(),
  body: faker.random.objectElement()
})

export function mockGetRequest (): HttpGetParams {
  return {
    url: faker.internet.url()
  }
} 

export class HttpPostClientSpy<R> implements HttpPostClient<R> {
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

export class HttpGetClientSpy<T> implements HttpGetClient<T> {
  url: string
  response: HttpResponse<T> = {
    statusCode: HttpStatusCode.ok
  }

  async get (params: HttpGetParams): Promise<HttpResponse<T>> {
    this.url = params.url
    return this.response
  }
}

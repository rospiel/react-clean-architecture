import { HttpRequest, } from '@/data/protocols/http'
import { HttpMethod, HttpStatusCode } from '@/domain/enums'
import { faker } from '@faker-js/faker'
import HttpClient, { HttpResponse } from '@/data/protocols/http/http-client'

export const mockHttpRequest = (): HttpRequest => ({
  url: faker.internet.url(),
  method: faker.helpers.enumValue(HttpMethod),
  headers: faker.person.fullName(),
  body: faker.person.fullName()
})

export class HttpClientSpy<R = any> implements HttpClient<R> {
  url?: string
  body?: any
  method?: HttpMethod
  headers?: any
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok
  }

  async request (data: HttpRequest): Promise<HttpResponse<R>> {
    this.url = data.url
    this.method = data.method
    this.body = data.body
    this.headers = data.headers
    return this.response
  }
}


import HttpClient, { HttpRequest, HttpResponse } from '@/data/protocols/http/http-client'
import Axios, { AxiosResponse } from 'axios'

export class AxiosHttpClient implements HttpClient {
  async request (request: HttpRequest): Promise<any> {
    let response: AxiosResponse<any>
    try {
      response = await Axios.request({
        url: request.url,
        method: request.method,
        data: request.body,
        headers: request.headers
      })
    } catch (error) {
      response = error.response
    }

    return this.adapt(response)
  }

  private adapt (response: AxiosResponse): HttpResponse {
    return {
      statusCode: response.status,
      body: response.data
    }
  }
}

import { HttpGetClient, HttpGetParams, HttpPostClient, HttpPostClientParams, HttpResponse } from '@/data/protocols/http'
import Axios, { AxiosResponse } from 'axios'

export class AxiosHttpClient implements HttpPostClient, HttpGetClient {
  async post (params: HttpPostClientParams): Promise<any> {
    let response: AxiosResponse<any>
    try {
      response = await Axios.post(params.url, params.body)
    } catch (error) {
      response = error.response
    }

    return this.adapt(response)
  }

  async get (params: HttpGetParams): Promise<HttpResponse> {
    let response: AxiosResponse
    try {
      response = await Axios.get(params.url)
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

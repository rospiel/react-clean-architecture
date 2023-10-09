import { HttpPostClient, HttpPostClientParams } from '@/data/protocols/http'
import Axios, { AxiosResponse } from 'axios'

export class AxiosHttpClient implements HttpPostClient<any, any> {
  async post (params: HttpPostClientParams<any>): Promise<any> {
    let response: AxiosResponse<any>
    try {
      response = await Axios.post(params.url, params.body)
    } catch (error) {
      response = error.response
    }

    return {
      statusCode: response.status,
      body: response.data
    }
  }
}

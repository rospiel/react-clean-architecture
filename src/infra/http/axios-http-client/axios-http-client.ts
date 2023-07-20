import { HttpPostClient, HttpPostClientParams } from '@/data/protocols/http'
import Axios from 'axios'

export class AxiosHttpClient implements HttpPostClient<any, any> {
  async post (params: HttpPostClientParams<any>): Promise<any> {
    const response = await Axios.post(params.url, params.body)
    return {
      statusCode: response.status,
      body: response.data
    }
  }
}

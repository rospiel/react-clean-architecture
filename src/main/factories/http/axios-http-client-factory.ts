import { AxiosHttpClient } from '@/infra/http/axios-http-client/axios-http-client'

export default function makeAxiosHttpClint (): AxiosHttpClient {
  return new AxiosHttpClient()
}

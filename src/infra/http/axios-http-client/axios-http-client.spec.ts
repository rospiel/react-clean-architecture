import { mockHttpRequest } from '@/data/test'
import { mockAxios, mockHttpResponse } from '@/infra/test'
import Axios from 'axios'
import { AxiosHttpClient } from './axios-http-client'

jest.mock('axios')
type SutTypes = {
  sut: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof Axios>
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient()
  const mockedAxios = mockAxios()
  return {
    sut,
    mockedAxios
  }
}

describe('AxiosHttpClient', () => {
  test('[GET] - should call axios with correct values', async () => {
    const request = mockHttpRequest()
    const { mockedAxios, sut } = makeSut()
    await sut.request(request)
    expect(mockedAxios.request).toHaveBeenCalledWith({  
      headers: request.headers,
      url: request.url,
      method: request.method,
      data: request.body
    })
  })

  test('[GET] - should return the correct http code and body', async () => {
    const { mockedAxios, sut } = makeSut()
    const response = await sut.request(mockHttpRequest())
    const axios = await mockedAxios.request.mock.results[0].value
    expect(response).toEqual({
      statusCode: axios.status,
      body: axios.data
    })
  })
})

import { mockPostRequest } from '@/data/test'
import { mockAxios } from '@/infra/test'
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
  test('should call axios with correct values', async () => {
    const request = mockPostRequest()
    const { mockedAxios, sut } = makeSut()
    await sut.post(request)
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  test('should return the correct http code and body', () => {
    const { mockedAxios, sut } = makeSut()
    const promise = sut.post(mockPostRequest())
    /* [0] --> mock resolved, [1] --> mock rejected */
    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })
})

import { mockGetRequest, mockPostRequest } from '@/data/test'
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
  describe('post', function () {
    test('[POST] - should call axios with correct values', async () => {
      const request = mockPostRequest()
      const { mockedAxios, sut } = makeSut()
      await sut.post(request)
      expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
    })
  
    test('[POST] - should return the correct http code and body',  async () => {
      const { mockedAxios, sut } = makeSut()
      const response = await sut.post(mockPostRequest())
      const axios = await mockedAxios.post.mock.results[0].value
      expect(response).toEqual({
        statusCode: axios.status,
        body: axios.data
      })
    })
  
    test('[POST] - should return the correct http code and body when failure', () => {
      const { mockedAxios, sut } = makeSut()
      mockedAxios.post.mockRejectedValueOnce({
        response: mockHttpResponse
      })
  
      const promise = sut.post(mockPostRequest())
      expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
    })
  })

  describe('get', function () {
    test('[GET] - should call axios with correct values', async () => {
      const request = mockGetRequest()
      const { mockedAxios, sut } = makeSut()
      await sut.get(request)
      expect(mockedAxios.get).toHaveBeenCalledWith(request.url)
    })

    test('[GET] - should return the correct http code and body', async () => {
      const { mockedAxios, sut } = makeSut()
      const response = await sut.get(mockGetRequest())
      const axios = await mockedAxios.get.mock.results[0].value
      expect(response).toEqual({
        statusCode: axios.status,
        body: axios.data
      })
    })

    test('[GET] - should return correct error when get fails', () => {
      const { mockedAxios, sut } = makeSut()
      mockedAxios.get.mockRejectedValueOnce({
        response: mockHttpResponse()
      })
      const axios = sut.get(mockGetRequest())
      expect(axios).toEqual(mockedAxios.get.mock.results[0].value)
    })
  })
})

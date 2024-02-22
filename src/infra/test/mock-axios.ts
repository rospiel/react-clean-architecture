import { mockGetRequest } from '@/data/test'
import Axios from 'axios'
import { faker } from '@faker-js/faker'

export const mockHttpResponse = (): any => ({
  data: faker.person.fullName(),
  status: faker.number.int()
})

export const mockAxios = (): jest.Mocked<typeof Axios> => {
  const mockedAxios = Axios as jest.Mocked<typeof Axios>
  mockedAxios.post.mockClear().mockResolvedValue(mockHttpResponse())
  mockedAxios.get.mockClear().mockResolvedValue(mockHttpResponse())
  return mockedAxios
}

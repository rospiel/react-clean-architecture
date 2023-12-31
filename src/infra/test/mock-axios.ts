import Axios from 'axios'
import faker from 'faker'

export const mockHttpResponse = (): any => ({
  data: faker.random.objectElement(),
  status: faker.random.number()
})

export const mockAxios = (): jest.Mocked<typeof Axios> => {
  const mockedAxios = Axios as jest.Mocked<typeof Axios>
  mockedAxios.post.mockResolvedValue(mockHttpResponse())
  return mockedAxios
}

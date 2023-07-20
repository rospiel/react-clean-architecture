import Axios from 'axios'
import faker from 'faker'

export const mockAxios = (): jest.Mocked<typeof Axios> => {
  const mockedAxios = Axios as jest.Mocked<typeof Axios>
  mockedAxios.post.mockResolvedValue({
    data: faker.random.objectElement(),
    status: faker.random.number()
  })

  return mockedAxios
}

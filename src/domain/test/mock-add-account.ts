import { AddAccountParams } from '@/domain/usecases'
import faker from 'faker'

export function mockAddAccountParams (): AddAccountParams {
  const password = faker.internet.password()
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  }
}

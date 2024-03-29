import { AddAccountParams } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export function mockAddAccountParams (): AddAccountParams {
  const password = faker.internet.password()
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  }
}

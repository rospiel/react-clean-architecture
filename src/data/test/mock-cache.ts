import { GetStorage } from '@/data/protocols/cache/get-storage'
import { AccountModel } from '@/domain/models'
import { faker } from '@faker-js/faker'

export class GetStorageSpy implements GetStorage {
  key: string
  value: any = faker.person.fullName()

  get (key: string): any {
    this.key = key
    return this.value
  }
}

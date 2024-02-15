import { RemoteAddAccount } from '@/data/usecases/add-account/remote-add-account'
import { AddAccount } from '@/domain/usecases'
import makeApiUrl from '@/main/factories/http/api-url-factory'
import makeAxiosHttpClint from '@/main/factories/http/axios-http-client-factory'

export function makeRemoteAddAccount (): AddAccount {
  return new RemoteAddAccount(makeApiUrl('/signup'), makeAxiosHttpClint())
}

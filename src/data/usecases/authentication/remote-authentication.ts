import { HttpPostClient, HttpPostClientParams } from '@/data/protocols/http'
import { HttpStatusCode } from '@/data/protocols/http/http-response'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { AuthenticationParams, Authentication } from '@/domain/usecases'

export class RemoteAuthentication implements Authentication {
  constructor (
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<AccountModel>
  ) { }

  async auth (params: AuthenticationParams): Promise<AccountModel> {
    const httpPostClientParams: HttpPostClientParams = {
      url: this.url,
      body: params
    }
    const response = await this.httpPostClient.post(httpPostClientParams)

    switch (response.statusCode) {
      case HttpStatusCode.ok: return response.body
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError()
      default:
        throw new UnexpectedError()
    }
  }
}

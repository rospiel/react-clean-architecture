import { HttpRequest } from '@/data/protocols/http'
import HttpClient from '@/data/protocols/http/http-client'
import { HttpMethod } from '@/domain/enums'
import { HttpStatusCode } from '@/domain/enums/http-status-code'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { AuthenticationParams, Authentication } from '@/domain/usecases'

export class RemoteAuthentication implements Authentication {
  constructor (
    private readonly url: string,
    private readonly httpPostClient: HttpClient<AccountModel>
  ) { }

  async auth (params: AuthenticationParams): Promise<AccountModel> {
    const httpRequest: HttpRequest = {
      url: this.url,
      body: params,
      method: HttpMethod.POST
    }
    const response = await this.httpPostClient.request(httpRequest)

    switch (response.statusCode) {
      case HttpStatusCode.ok: return response.body
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError()
      default:
        throw new UnexpectedError()
    }
  }
}

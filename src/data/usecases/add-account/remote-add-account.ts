import { HttpRequest } from '@/data/protocols/http'
import { AccountModel } from '@/domain/models'
import { AddAccount, AddAccountParams } from '@/domain/usecases'
import { EmailInUseError, UnexpectedError } from '@/domain/errors'
import { HttpMethod, HttpStatusCode } from '@/domain/enums'
import HttpClient from '@/data/protocols/http/http-client'

export class RemoteAddAccount implements AddAccount {
  constructor (private readonly url: string, private readonly httpClient: HttpClient) { }

  async add (params: AddAccountParams): Promise<AccountModel> {
    const response = await this.httpClient.request({
      url: this.url,
      body: params, 
      method: HttpMethod.POST
    })

    switch (response.statusCode) {
      case HttpStatusCode.ok: return response.body
      case HttpStatusCode.forbidden: throw new EmailInUseError()
      default: throw new UnexpectedError()
    }
  }
}

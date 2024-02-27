import { GetStorage } from "@/data/protocols/cache/get-storage";
import { HttpRequest, HttpResponse } from "@/data/protocols/http";
import HttpClient from "@/data/protocols/http/http-client";

export class AuthorizeHttpClientDecorator implements HttpClient {
    constructor (private readonly getStorage: GetStorage, 
                 private readonly httpClient: HttpClient) {}
    
    async request (params: HttpRequest): Promise<HttpResponse> {
        const account = this.getStorage.get('account')
        
        if (account?.accessToken) {
            Object.assign(params, {
                headers: Object.assign(this.mergeOrEmptyObject(params), {
                    'x-access-token': account.accessToken
                })
            })
        }

        return await this.httpClient.request(params)
    }

    private mergeOrEmptyObject (params: HttpRequest): object {
        return params.headers || {}
    }
}
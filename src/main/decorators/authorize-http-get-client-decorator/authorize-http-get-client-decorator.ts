import { GetStorage } from "@/data/protocols/cache/get-storage";
import { HttpGetClient, HttpGetParams, HttpResponse } from "@/data/protocols/http";

export class AuthorizeHttpGetClientDecorator implements HttpGetClient {
    constructor (private readonly getStorage: GetStorage, 
                 private readonly httpGetClient: HttpGetClient) {}
    
    async get (params: HttpGetParams): Promise<HttpResponse> {
        const account = this.getStorage.get('account')
        
        if (account?.accessToken) {
            Object.assign(params, {
                headers: Object.assign(this.mergeOrEmptyObject(params), {
                    'X-Access-Token': account.accessToken
                })
            })
        }

        return await this.httpGetClient.get(params)
    }

    private mergeOrEmptyObject (params: HttpGetParams): object {
        return params.headers || {}
    }
}
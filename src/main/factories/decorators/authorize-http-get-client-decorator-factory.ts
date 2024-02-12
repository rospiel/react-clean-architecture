import { HttpGetClient } from "@/data/protocols/http";
import { AuthorizeHttpGetClientDecorator } from "@/main/decorators";
import { makeLocalStorageAdapter } from "@/main/factories/cache/local-storage-adapter-factory";
import makeAxiosHttpClint from "@/main/factories/http/axios-http-client-factory";

export default function makeAuthorizeHttpGetClientDecorator (): HttpGetClient {
    return new AuthorizeHttpGetClientDecorator(makeLocalStorageAdapter(), makeAxiosHttpClint())
}
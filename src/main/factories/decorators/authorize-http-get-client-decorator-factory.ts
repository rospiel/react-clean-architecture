import HttpClient from "@/data/protocols/http/http-client";
import { AuthorizeHttpClientDecorator } from "@/main/decorators";
import { makeLocalStorageAdapter } from "@/main/factories/cache/local-storage-adapter-factory";
import makeAxiosHttpClint from "@/main/factories/http/axios-http-client-factory";

export default function makeAuthorizeHttpClientDecorator (): HttpClient {
    return new AuthorizeHttpClientDecorator(makeLocalStorageAdapter(), makeAxiosHttpClint())
}
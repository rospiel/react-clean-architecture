import { HttpResponse } from '.'

export type HttpPostClientParams = {
  url: string
  body?: any
}

export interface HttpPostClient<R = any> {
  post: (params: HttpPostClientParams) => Promise<HttpResponse<R>>
}

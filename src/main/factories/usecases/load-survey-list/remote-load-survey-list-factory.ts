import { RemoteLoadSurveyList } from "@/data/usecases/load-survey-list/remote-load-survey-list";
import { LoadSurveyList } from "@/domain/usecases";
import makeApiUrl from "@/main/factories/http/api-url-factory";
import makeAuthorizeHttpClientDecorator from "@/main/factories/decorators/authorize-http-get-client-decorator-factory";

export default function makeRemoteLoadSurveyList (): LoadSurveyList {
    return new RemoteLoadSurveyList(makeApiUrl('/surveys'), makeAuthorizeHttpClientDecorator())
}
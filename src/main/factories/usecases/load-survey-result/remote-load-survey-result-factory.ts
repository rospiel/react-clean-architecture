import { RemoteLoadSurveyResult } from "@/data/usecases/load-survey-result/remote-load-survey-result";
import { LoadSurveyResult } from "@/domain/usecases";
import makeApiUrl from "../../http/api-url-factory";
import makeAuthorizeHttpGetClientDecorator from "../../decorators/authorize-http-get-client-decorator-factory";

export default function makeRemoteLoadSurveyResult (): LoadSurveyResult {
    return new RemoteLoadSurveyResult(makeApiUrl('/surveys/{id}/results'), makeAuthorizeHttpGetClientDecorator())
}
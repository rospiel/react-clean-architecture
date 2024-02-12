import { RemoteLoadSurveyList } from "@/data/usecases/load-survey-list/remote-load-survey-list";
import { LoadSurveyList } from "@/domain/usecases";
import makeApiUrl from "@/main/factories/http/api-url-factory";
import makeAxiosHttpClint from "@/main/factories/http/axios-http-client-factory";

export default function makeRemoteLoadSurveyList (): LoadSurveyList {
    return new RemoteLoadSurveyList(makeApiUrl('/surveys'), makeAxiosHttpClint())
}
import { LoadSurveyResultModel } from '@/domain/models/survey-result-model'

export interface LoadSurveyResult {
    load: () => Promise<LoadSurveyResultModel>
}
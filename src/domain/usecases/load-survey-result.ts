import { LoadSurveyResultModel } from '@/domain/models/survey-result-model'

export interface LoadSurveyResult {
    load: (id: string) => Promise<LoadSurveyResultModel>
}
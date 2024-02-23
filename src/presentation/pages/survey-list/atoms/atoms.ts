import { SurveyModel } from '@/domain/models'
import { atom } from 'recoil'

export const surveyListState = atom({
  key: 'surveyListState',
  default: {
    surveys: [] as SurveyModel[], 
    error: '',
    reload: false
  }
})
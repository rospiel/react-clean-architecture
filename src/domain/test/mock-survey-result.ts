import { AnswerResultModel, LoadSurveyResultModel, SurveyModel } from '@/domain/models'
import faker from 'faker'
import { LoadSurveyResult } from '../usecases'

function mockAnswerResultModel (isCurrentAccountAnswer: boolean, hasImage: boolean): AnswerResultModel {
    return {
        image: hasImage ? faker.internet.url() : null,
        answer: faker.random.words(5),
        count: faker.random.number(),
        percent: faker.random.number(100),
        isCurrentAccountAnswer
    }
}

export function mockSurveyResultModel (): LoadSurveyResultModel {
    return {
        surveyId: faker.random.uuid(),
        question: faker.random.words(9),
        answers: [mockAnswerResultModel(true, false), mockAnswerResultModel(false, true)],
        date: faker.date.recent()
    }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
    callsCount = 0
    surveyResultModel = mockSurveyResultModel()

    async load (): Promise<LoadSurveyResultModel> {
        this.callsCount++
        return this.surveyResultModel
    }
}
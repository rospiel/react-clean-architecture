import { AnswerResultModel, LoadSurveyResultModel, SurveyModel } from '@/domain/models'
import { faker } from '@faker-js/faker'
import { LoadSurveyResult } from '../usecases'

function mockAnswerResultModel (isCurrentAccountAnswer: boolean, hasImage: boolean): AnswerResultModel {
    return {
        image: hasImage ? faker.internet.url() : null,
        answer: faker.word.words(),
        count: faker.number.int(),
        percent: faker.number.int(100),
        isCurrentAccountAnswer
    }
}

export function mockSurveyResultModel (): LoadSurveyResultModel {
    return {
        surveyId: faker.string.uuid(),
        question: faker.word.words(9),
        answers: [mockAnswerResultModel(true, false), mockAnswerResultModel(false, true)],
        date: faker.date.recent()
    }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
    callsCount = 0
    surveyResultModel = mockSurveyResultModel()

    async load (id: string): Promise<LoadSurveyResultModel> {
        this.callsCount++
        return this.surveyResultModel
    }
}
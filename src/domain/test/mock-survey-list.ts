import { SurveyModel } from '@/domain/models'
import faker from 'faker'
import { LoadSurveyList } from '@/domain/usecases/load-survey-list'

export function mockSurveyModel (): SurveyModel {
    return {
        id: faker.random.uuid(),
        question: faker.random.words(9),
        answers: [{
            answer: faker.random.words(5),
            image: faker.internet.url()
        }, 
        {
            answer: faker.random.words(5)
        }],
        didAnswer: faker.random.boolean(),
        date: faker.date.recent()
    }
}

export function mockSurveyListModel (): SurveyModel[] {
    return [
        mockSurveyModel(),
        mockSurveyModel(),
        mockSurveyModel(),
        mockSurveyModel(),
        mockSurveyModel()
    ]
}

export class LoadSurveyListSpy implements LoadSurveyList {
    callsCount = 0
    surveys = mockSurveyListModel()

    async all (): Promise<SurveyModel[]> {
        this.callsCount++
        return this.surveys
    }
}
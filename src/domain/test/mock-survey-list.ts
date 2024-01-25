import { SurveyModel } from '../models'
import faker from 'faker'

export function mockSurveyListModel (): SurveyModel[] {
    return [{
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
    }]
}
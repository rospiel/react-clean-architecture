import * as Helper from '../utils/helpers'
import { mockResponse, mockResponseBy } from '../utils/http-mocks'
import { faker } from '@faker-js/faker'

describe('SurveyResult', function () {
    
    const idSurvey = faker.string.alphanumeric()
    const url = `/api/surveys/${idSurvey}/results`
    const visit = `/surveys/${idSurvey}`
    
    beforeEach(function () {
        cy.fixture('account').then(value => Helper.setLocalStorageItem('account', value))
    })
    
    it('Should render error when throw UnexpectedError but if try again should render', function () {
        mockResponseBy('GET', url, 500, 'error')
        cy.visit(visit)
        cy.getByTestId('error').should('contain.text', 'Instabilidade no sistema. Tente novamente em breve.')

        mockResponseBy('GET', url, 200, 'survey-result')
        cy.getByTestId('reload').click()
        cy.get('li:not(:empty)').should('have.length', 2)
    })

    it('Should logout when throw AccessDeniedError', function () {
        mockResponseBy('GET', url, 403, 'error')
        cy.visit(visit)
        Helper.testUrl('/login')
    })

    it('Should render success', function () {
        mockResponseBy('GET', url, 200, 'survey-result')
        cy.visit(visit)
        const account = Helper.getLocalStorageItem('account')
        const surveyResult = cy.fixture('survey-result')
        cy.getByTestId('username').should('contain.text', account.name)
        
        
        cy.fixture('survey-result').then(item => {
            cy.getByTestId('day').should('contain.text', new Date(item['date']).getDate().toString())
            cy.getByTestId('month').should('contain.text', new Date(item['date']).toLocaleString('pt-BR', { month: 'short' }).replace('.', ''))
            cy.getByTestId('year').should('contain.text', String(new Date(item['date']).getFullYear()))
            cy.getByTestId('question').should('contain.text', item['question'])
            cy.get('li:nth-child(1)').then(li => {
                assert.equal(li.find('[data-testid="answer"]').text(), item['answers'][0].answer)
                assert.equal(li.find('[data-testid="percent"]').text(), `${item['answers'][0].percent}%`)
                assert.equal(li.find('[data-testid="image"]').attr('src'), item['answers'][0].image)
            })

            cy.get('li:nth-child(2)').then(li => {
                assert.notExists(li.find('[data-testid="image"]'))
            })
        })
    })

    it('Should redirect to previous page when click go back', function () {
        mockResponseBy('GET', url, 200, 'survey-result')
        cy.visit('')
        cy.visit(visit)
        cy.getByTestId('back-button').click()
        mockResponseBy('GET', 'api/surveys', 200, 'survey-list')
        Helper.testUrl('/')
    })
})
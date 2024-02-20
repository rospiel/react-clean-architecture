import * as Helper from '../utils/helpers'
import faker from 'faker'
import { mockResponse } from '../utils/http-mocks'

describe('SurveyResult', function () {
    
    
    beforeEach(function () {
        cy.fixture('account').then(value => Helper.setLocalStorageItem('account', value))
    })
    
    it('Should render error when throw UnexpectedError but if try again should render', function () {
        mockResponse('GET', /surveys/, 500, { error: faker.random.words() })
        cy.visit('surveys/id')
        cy.getByTestId('error').should('contain.text', 'Instabilidade no sistema. Tente novamente em breve.')

        mockResponse('GET', /surveys/, 200, 'fx:survey-result')
        cy.getByTestId('reload').click()
        cy.get('li:not(:empty)').should('have.length', 2)
    })

    it('Should logout when throw AccessDeniedError', function () {
        mockResponse('GET', /surveys/, 403, { error: faker.random.words() })
        cy.visit('surveys/id')
        Helper.testUrl('/login')
    })

    it('Should render success', function () {
        mockResponse('GET', /surveys/, 200, 'fx:survey-result')
        cy.visit('surveys/id')
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
        mockResponse('GET', /surveys/, 200, 'fx:survey-result')
        cy.visit('')
        cy.visit('surveys/id')
        cy.getByTestId('back-button').click()
        mockResponse('GET', /surveys/, 200, 'fx:survey-list')
        Helper.testUrl('/')
    })
})
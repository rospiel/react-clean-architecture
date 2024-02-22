import * as Helper from '../utils/helpers'
import { mockResponse } from '../utils/http-mocks'

const thumbDown = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFKADAAQAAAABAAAAEgAAAAA9nQVdAAAA70lEQVQ4Ea2RPQoCQQyFZ/w5g72lYOEVPIiV2IkIHmCvIZ5D77BgZWtrYWe1ICiuL8tEwjIZZmYNZCf7knyTzRrjrK7rAfwAr+AheyNZwiei98gNrBkISxYjz5KbZb0V4gXxlN8jzo+1tk91BOT6nhPmOFNg1Nb0UiCNxY0Uu8QW044BuMIZHs3DJzcra3/yOgem3UoT3pEcaQUh3TchAX9/KNTsy/mAtLebrzhXI+AqE/oQl55ErIfYxp5WothW71QyAJ0VWKG06DJAQ/jTA0yH0TUAzf4Gc8BFC5g3GcHI3IQvBy0asesDsB08CfYFB/44kX6+Hj8AAAAASUVORK5CYII='
const thumbUp = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFKADAAQAAAABAAAAEgAAAAA9nQVdAAAA0klEQVQ4EWNgIAH8//+/AYhLSNCCWynUMCD1/zcQG+BWSYQMkmEgA0Egjght2JUANYO8iQ4MsasmIAo0BZthP4DirAS0YkrjMAzk0tOYqgmIADUVgnTiADPxakfStAWmECj2DkmcWOYjoEJPRpBqmEGMQABiI4vB5IikH1PbQAYmIm0mVtlLahu4nJpe/gf0hho1XbgVGKd3qWngRFBA4/LyX6AcKZZdBbpOB2QgLk1nQJIkgElwtaBEDAXIOUULKHYSiP/CJHHQX4Hic4CYBWYgADx8PyqFiuhJAAAAAElFTkSuQmCC'

describe('SurveyList', function () {
    
    
    beforeEach(function () {
        cy.fixture('account').then(value => Helper.setLocalStorageItem('account', value))
    })
    
    it('Should render error when throw UnexpectedError but if try again should render', function () {
        mockResponse('GET', /surveys/, 500, 'error')
        cy.visit('')
        cy.getByTestId('error').should('contain.text', 'Instabilidade no sistema. Tente novamente em breve.')

        mockResponse('GET', /surveys/, 200, 'survey-list')
        cy.getByTestId('reload').click()
        cy.get('li:not(:empty)').should('have.length', 2)
    })

    it('Should logout when throw AccessDeniedError', function () {
        mockResponse('GET', /surveys/, 403, 'error')
        cy.visit('')
        Helper.testUrl('/login')
    })

    it('Should render success', function () {
        mockResponse('GET', /surveys/, 200, 'survey-list')
        cy.visit('')
        const account = Helper.getLocalStorageItem('account')
        cy.getByTestId('username').should('contain.text', account.name)
        
        cy.fixture('survey-list').each(item => {
            cy.get('ul li').each(li => {
                if (li.find('p').text() === item['question']) {
                    assert.equal(li.find('[data-testid="day"]').text(), new Date(item['date']).getDate().toString())
                    assert.equal(li.find('[data-testid="month"]').text(), new Date(item['date']).toLocaleString('pt-BR', { month: 'short' }).replace('.', ''))
                    assert.equal(li.find('[data-testid="year"]').text(), String(new Date(item['date']).getFullYear()))
                    assert.equal(li.find('[data-testid="icon"]').attr('src'), item['didAnswer'] ? thumbUp : thumbDown)
                }
            })
        })
    })

    it('Should when request logout', function () {
        mockResponse('GET', /surveys/, 200, 'survey-list')
        cy.visit('')
        cy.getByTestId('logout').click()
        Helper.testUrl('/login')
    })
})
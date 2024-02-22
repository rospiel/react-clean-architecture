import * as Helper from '../utils/helpers'

describe('Private routes', function () {
    it('Should logout when without a token on main page', function () {
        cy.visit('')
        Helper.testUrl('/login')
    })

    it('Should logout when without a token on survey result page', function () {
        cy.visit('/surveys/id')
        Helper.testUrl('/login')
    })
})
import * as Helper from '../utils/helpers'

describe('Private routes', function () {
    it('Should logout when without a token', function () {
        cy.visit('')
        Helper.testUrl('/login')
    })
})
import React from 'react'
import { render } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import PrivateRoute from './private-route'
import { mockAccountModel } from '@/domain/test'
import ApiContext from '@/presentation/contexts/api/api-context'

type SutTypes = {
    history: MemoryHistory
}

function makeSut (account = mockAccountModel()): SutTypes {
    const history = createMemoryHistory({ initialEntries: ['/'] })
    render(
        <ApiContext.Provider value={{ getCurrentAccount: () => account }}>
            <Router history={history}>
                <PrivateRoute />
            </Router>
        </ApiContext.Provider>
    )

    return { history }
}

describe('PrivateRoute', function () {
    test('Should redirect to /login when token is empty', function () {
        const { history } = makeSut(null)
        expect(history.location.pathname).toBe('/login')
    })

    test('Should render current component when token is present', function () {
        const { history } = makeSut()
        expect(history.location.pathname).toBe('/')
    })
})
import React from 'react'
import { Header } from '@/presentation/components'
import ApiContext from '@/presentation/contexts/api/api-context'
import { render, fireEvent, screen } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'

type SutTypes = {
    history: MemoryHistory
    setCurrentAccountMock: (account: AccountModel) => void
}

function makeSut (account = mockAccountModel()): SutTypes {
    const history = createMemoryHistory({ initialEntries: ['/'] })
    const setCurrentAccountMock = jest.fn()
    render(
        <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, 
                                      getCurrentAccount: () => account }}>
            <Router history={history}>
                <Header />
            </Router>
        </ApiContext.Provider>
    )

    return {
        history, 
        setCurrentAccountMock
    }
}

describe('Header Component', function () {
    test('Should call setCurrentAccount on action logout', function () {
        const { history, setCurrentAccountMock } = makeSut()

        fireEvent.click(screen.getByTestId('logout'))
        expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
        expect(history.location.pathname).toBe('/login')
    })

    test('Should render name from account', function () {
        const account = mockAccountModel()
        makeSut(account)

        expect(screen.getByTestId('username')).toHaveTextContent(account.name)
    })
})
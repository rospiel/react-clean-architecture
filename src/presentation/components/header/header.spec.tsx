import React from 'react'
import { Header } from '@/presentation/components'
import { fireEvent, screen } from '@testing-library/react'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import renderHelper from '@/presentation/test/render-helper'

type SutTypes = {
    history: any
    setCurrentAccountMock: (account: AccountModel) => void
}

function makeSut (account = mockAccountModel()): SutTypes {
    const { createBrowserHistory } = require("history");
    const history = createBrowserHistory({ initialEntries: ['/'] })
    
    const { setCurrentAccountMock } = renderHelper({
        component: <Header />, 
        history, 
        account
    })

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
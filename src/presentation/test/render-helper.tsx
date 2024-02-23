import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { render } from '@testing-library/react'
import React from 'react'
import { Router } from 'react-router-dom'
import ApiContext from '../contexts/api/api-context'

type RenderHelperProps = {
    component: JSX.Element
    history: any
    account?: AccountModel
}

type RenderHelperResult = {
    setCurrentAccountMock: (account: AccountModel) => void
}

export default function renderHelper ({ component, history, account = mockAccountModel() }: RenderHelperProps): RenderHelperResult {
    const setCurrentAccountMock = jest.fn()
    
    render(
        <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, 
            getCurrentAccount: () => account }}>
            <Router navigator={history} location={history.location} >
                {component}
            </Router>
        </ApiContext.Provider>
    )

    return {
        setCurrentAccountMock
    }

}
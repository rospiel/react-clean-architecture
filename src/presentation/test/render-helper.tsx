import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { render } from '@testing-library/react'
import React from 'react'
import { Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { currentAccountState } from '../components/atoms/atoms'

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
    const mockedState = { setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => account }
    
    render(
        <RecoilRoot initializeState={({ set }) => set(currentAccountState, mockedState)}>
            <Router navigator={history} location={history.location} >
                {component}
            </Router>
        </RecoilRoot>
    )

    return {
        setCurrentAccountMock
    }

}
import React, { isValidElement } from 'react'
import { cleanup, render } from '@testing-library/react'
import { BrowserRouter, Route, Router, RouterProvider, Routes, createMemoryRouter } from 'react-router-dom'
import PrivateRoute from './private-route'
import { mockAccountModel } from '@/domain/test'
import { RecoilRoot } from 'recoil'
import { currentAccountState } from '../atoms/atoms'


function makeSut (account = mockAccountModel()): void {
    const mockedState = { setCurrentAccount: jest.fn(), getCurrentAccount: () => account }

    render( 
        <RecoilRoot initializeState={({ set }) => set(currentAccountState, mockedState)}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<PrivateRoute />}>
                        <Route path="/" element={<></>} />
                    </Route>
                    <Route path="/login" element={<></>} />
                </Routes>
            </BrowserRouter>
        </RecoilRoot>
    )
}

describe('PrivateRoute', function () {
    afterEach(cleanup)
    
    test('Should redirect to /login when token is empty', function () {
        makeSut(null)
        expect(global.window.location.href).toContain('/login')
    })

    test('Should render current component when token is present', function () {
        makeSut()
        expect(global.window.location.href).toContain('/')
    })
})
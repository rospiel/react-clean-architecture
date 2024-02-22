import React, { isValidElement } from 'react'
import { cleanup, render } from '@testing-library/react'
import { BrowserRouter, Route, Router, RouterProvider, Routes, createMemoryRouter } from 'react-router-dom'
import PrivateRoute from './private-route'
import { mockAccountModel } from '@/domain/test'
import ApiContext from '@/presentation/contexts/api/api-context'


function makeSut (account = mockAccountModel()): void {
    render( 
        <ApiContext.Provider value={{ getCurrentAccount: () => account }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<PrivateRoute />}>
                        <Route path="/" element={<></>} />
                    </Route>
                    <Route path="/login" element={<></>} />
                </Routes>
            </BrowserRouter>
        </ApiContext.Provider>
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
import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import makeLogin from '@/main/factories/pages/login/login-factory'
import makeSignUp from '@/main/factories/pages/signup/signup-factory'
import makeSurveyList from '@/main/factories/pages/survey-list/survey-list-factory'
import makeSurveyResult from '../factories/pages/survey-result/survey-result-factory'
import PrivateRoute from '@/presentation/components/private-route/private-route'
import setCurrentAccountAdapter, { getCurrentAccountAdapter } from '../adapters/current-account-adapter'
import { RecoilRoot } from 'recoil'
import { AccountModel } from '@/domain/models'
import { currentAccountState } from '@/presentation/components/atoms/atoms'


export type RouterState = {
  setCurrentAccount: (account: AccountModel) => void
  getCurrentAccount: () => AccountModel
} 

export default function Router (): JSX.Element {
  const state: RouterState = {
    setCurrentAccount: setCurrentAccountAdapter, 
    getCurrentAccount: getCurrentAccountAdapter
  }

  const PLACE = `${process.env.PLACE}`

  function getBaseName (): string {
    return PLACE == 'production' ? '/react-clean-architecture-publish' : ''
  }

  return (
    <RecoilRoot initializeState={({ set }) => set(currentAccountState, state)}>
      <BrowserRouter basename={getBaseName()}>
        <Routes>
          <Route path="/login" element={makeLogin()} />
          <Route path="/signup" element={makeSignUp()} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={makeSurveyList()} />
          </Route>
          <Route path="/surveys/:id" element={<PrivateRoute />}>
            <Route path="/surveys/:id" element={makeSurveyResult()} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  )
}

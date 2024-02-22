import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import makeLogin from '@/main/factories/pages/login/login-factory'
import makeSignUp from '@/main/factories/pages/signup/signup-factory'
import makeSurveyList from '@/main/factories/pages/survey-list/survey-list-factory'
import makeSurveyResult from '../factories/pages/survey-result/survey-result-factory'
import PrivateRoute from '@/presentation/components/private-route/private-route'
import ApiContext from '@/presentation/contexts/api/api-context'
import setCurrentAccountAdapter, { getCurrentAccountAdapter } from '../adapters/current-account-adapter'

export default function Router (): JSX.Element {
  const PLACE = `${process.env.PLACE}`

  function getBaseName (): string {
    return PLACE == 'production' ? '/react-clean-architecture-publish' : ''
  }

  return (
    <ApiContext.Provider 
      value={{
        setCurrentAccount: setCurrentAccountAdapter,
        getCurrentAccount: getCurrentAccountAdapter
      }}>
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
    </ApiContext.Provider>
  )
}

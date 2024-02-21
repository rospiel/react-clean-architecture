import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import makeLogin from '@/main/factories/pages/login/login-factory'
import makeSignUp from '@/main/factories/pages/signup/signup-factory'
import ApiContext from '@/presentation/contexts/api/api-context'
import setCurrentAccountAdapter, { getCurrentAccountAdapter } from '@/main/adapters/current-account-adapter'
import { PrivateRoute } from '@/presentation/components'
import makeSurveyList from '@/main/factories/pages/survey-list/survey-list-factory'
import makeSurveyResult from '../factories/pages/survey-result/survey-result-factory'

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
        <Switch>
          <Route path="/login" exact component={makeLogin} />
          <Route path="/signup" exact component={makeSignUp} />
          <PrivateRoute path="/" exact component={makeSurveyList} />
          <PrivateRoute path="/surveys/:id" component={makeSurveyResult} />
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

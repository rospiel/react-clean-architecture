import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import makeLogin from '@/main/factories/pages/login/login-factory'
import makeSignUp from '@/main/factories/pages/signup/signup-factory'
import ApiContext from '@/presentation/contexts/api/api-context'
import setCurrentAccountAdapter, { getCurrentAccountAdapter } from '@/main/adapters/current-account-adapter'
import { PrivateRoute } from '@/presentation/components'
import MakeSurveyList from '@/main/factories/pages/survey-list/survey-list-factory'

export default function Router (): JSX.Element {
  return (
    <ApiContext.Provider 
      value={{
        setCurrentAccount: setCurrentAccountAdapter,
        getCurrentAccount: getCurrentAccountAdapter
      }}>
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact component={makeLogin} />
          <Route path="/signup" exact component={makeSignUp} />
          <PrivateRoute path="/" exact component={MakeSurveyList} />
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

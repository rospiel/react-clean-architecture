import SurveyList from '@/presentation/pages/survey-list/survey-list'
import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

type RouterProps = {
  makeLogin: React.FC
  makeSignUp: React.FC
}

export default function Router (props: RouterProps): React.ReactElement {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={props.makeLogin} />
        <Route path="/signup" exact component={props.makeSignUp} />
        <Route path="/" exact component={SurveyList} />
      </Switch>
    </BrowserRouter>
  )
}

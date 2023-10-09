import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

type RouterProps = {
  makeLogin: React.FC
}

export default function Router (props: RouterProps): React.ReactElement {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={props.makeLogin} />
      </Switch>
    </BrowserRouter>
  )
}

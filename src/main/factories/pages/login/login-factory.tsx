import { Login } from '@/presentation/pages'
import React from 'react'
import makeRemoteAuthentication from '@/main/factories/usecases/authentication/remote-authentication-factory'
import makeLoginValidation from '@/main/factories/pages/login/login-validation-factory'
import { makeLocalUpdateCurrentAccount } from '@/main/factories/usecases/update-current-account/local-update-current-account-factory'

export default function makeLogin (): React.ReactElement {
  return (
    <Login
      authentication={makeRemoteAuthentication()}
      validation={makeLoginValidation()}
      updateCurrentAccount={makeLocalUpdateCurrentAccount()}
    />
  )
}

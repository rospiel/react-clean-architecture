import { SignUp } from '@/presentation/pages'
import React from 'react'
import { makeRemoteAddAccount } from '@/main/factories/usecases/add-account/remote-add-account-factory'
import { makeSignUpValidation } from '@/main/factories/pages/signup/signup-validation-factory'
import { makeLocalUpdateCurrentAccount } from '@/main/factories/usecases/update-current-account/local-update-current-account-factory'

export function makeSignUp (): React.ReactElement {
  return (
    <SignUp
      addAccount={makeRemoteAddAccount()}
      validation={makeSignUpValidation()}
      updateCurrentAccount={makeLocalUpdateCurrentAccount()}
    />
  )
}

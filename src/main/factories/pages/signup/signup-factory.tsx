import { SignUp } from '@/presentation/pages'
import React from 'react'
import { makeRemoteAddAccount } from '@/main/factories/usecases/add-account/remote-add-account-factory'
import { makeSignUpValidation } from '@/main/factories/pages/signup/signup-validation-factory'
import { makeLocalSaveAccessToken } from '@/main/factories/usecases/save-access-token/local-save-access-token-factory'

export function makeSignUp (): React.ReactElement {
  return (
    <SignUp
      addAccount={makeRemoteAddAccount()}
      validation={makeSignUpValidation()}
      saveAccessToken={makeLocalSaveAccessToken()}
    />
  )
}

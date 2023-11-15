import React, { useState, useEffect } from 'react'
import Styles from './login-styles.scss'

import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication, SaveAccessToken } from '@/domain/usecases'
import { Link, useHistory } from 'react-router-dom'

type StateProps = {
  email: string
  password: string
  emailError: string
  passwordError: string
  message: string
  isLoading: boolean
}

type LoginProps = {
  validation: Validation
  authentication: Authentication
  saveAccessToken: SaveAccessToken
}

export default function Login (props: LoginProps): JSX.Element {
  function initialStateProps (): StateProps {
    return {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      message: '',
      isLoading: false
    }
  }

  const history = useHistory()
  const [state, setState] = useState<StateProps>(initialStateProps())

  useEffect(() => {
    const formData = { email: state.email, password: state.password }

    setState({
      ...state,
      emailError: props.validation.validate('email', formData),
      passwordError: props.validation.validate('password', formData)

    })
  }, [state.email, state.password])

  function hasError (): boolean {
    return !!state.emailError || !!state.passwordError
  }

  async function handleSubmit (event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    if (state.isLoading || hasError()) {
      return
    }

    setState({
      ...state,
      isLoading: true
    })

    try {
      const response = await props.authentication.auth({
        email: state.email,
        password: state.password
      })

      await props.saveAccessToken.save(response.accessToken)
      history.replace('/')
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        message: error.message
      })
    }
  }

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={ { state, setState } }>
        <form data-testid="form" className={Styles.form} onSubmit={handleSubmit} >
          <h2>Login</h2>
          <Input type="email" name="email" placeholder='Digite seu e-mail' />

          <Input type="password" name="password" placeholder='Digite sua senha' />

          <button type="submit" data-testid="submit" disabled={hasError()} className={Styles.submit}>Entrar</button>
          <Link data-testid="signup" to="/signup" className={Styles.link}>Criar conta</Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

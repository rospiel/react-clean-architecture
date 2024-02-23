import React, { useState, useEffect, useContext, useRef } from 'react'
import Styles from './login-styles.scss'

import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases'
import { Link, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { currentAccountState } from '@/presentation/components/atoms/atoms'

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

  const { setCurrentAccount } = useRecoilValue(currentAccountState)
  const history = useNavigate()
  const [state, setState] = useState<StateProps>(initialStateProps())
  const buttonElement = useRef(null);


  useEffect(() => {
    const formData = { email: state.email, password: state.password }

    setState(prevState => ({
      ...prevState,
      emailError: props.validation.validate('email', formData),
      passwordError: props.validation.validate('password', formData)

    }))
  }, [state.email, state.password])

  function hasError (): boolean {
    return !!state.emailError || !!state.passwordError
  }

  async function handleSubmit (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault()
    buttonElement.current.disabled = true

    if (state.isLoading || hasError()) {
      return
    }

    setState(prevState => ({
      ...prevState,
      isLoading: true
    }))

    try {
      const response = await props.authentication.auth({
        email: state.email,
        password: state.password
      })

      setCurrentAccount(response)
      history('/', { replace: true })
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        message: error.message
      }))
    }

    buttonElement.current.disabled = false
  }

  return (
    <div data-testid="login-page" className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={ { state, setState } }>
        <form data-testid="form" className={Styles.form} >
          <h2>Login</h2>
          <Input type="email" name="email" placeholder='Digite seu e-mail' />

          <Input type="password" name="password" placeholder='Digite sua senha' />

          <button ref={buttonElement} onClick={handleSubmit} type="submit" data-testid="submit" disabled={hasError()} className={Styles.submit}>Entrar</button>
          <Link data-testid="signup" to="/signup" className={Styles.link}>Criar conta</Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

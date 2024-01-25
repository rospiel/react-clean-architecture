import React, { useEffect, useState } from 'react'
import Styles from './signup-styles.scss'

import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Link, useHistory } from 'react-router-dom'
import { Validation } from '@/presentation/protocols/validation'
import { AddAccount, UpdateCurrentAccount } from '@/domain/usecases'

type StateProps = {
  name: string
  nameError: string
  email: string
  emailError: string
  password: string
  passwordError: string
  passwordConfirmation: string
  passwordConfirmationError: string
  isLoading: boolean
  message: string
}

type SignUpProps = {
  validation: Validation
  addAccount: AddAccount
  updateCurrentAccount: UpdateCurrentAccount
}

export default function SignUp (props: SignUpProps): JSX.Element {
  function initialStateProps (): StateProps {
    return {
      name: '',
      nameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      passwordConfirmation: '',
      passwordConfirmationError: '',
      isLoading: false,
      message: ''
    }
  }

  const history = useHistory()
  const [state, setState] = useState<StateProps>(initialStateProps())

  useEffect(() => {
    const formData = { name: state.name, email: state.email, password: state.password, passwordConfirmation: state.passwordConfirmation }

    setState({
      ...state,
      nameError: props.validation.validate('name', formData),
      emailError: props.validation.validate('email', formData),
      passwordError: props.validation.validate('password', formData),
      passwordConfirmationError: props.validation.validate('passwordConfirmation', formData)
    })
  }, [state.name, state.email, state.password, state.passwordConfirmation])

  function hasError (): boolean {
    return !!state.emailError || !!state.passwordError || !!state.nameError || !!state.passwordConfirmationError
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
      const account = await props.addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation
      })

      await props.updateCurrentAccount.save(account)
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
    <div className={Styles.signup}>
      <LoginHeader />
      <Context.Provider value={ { state, setState } }>
        <form data-testid="form" onSubmit={handleSubmit} className={Styles.form}>
          <h2>Criar Conta</h2>
          <Input type="text" name="name" placeholder='Digite seu nome' />

          <Input type="email" name="email" placeholder='Digite seu e-mail' />

          <Input type="password" name="password" placeholder='Digite sua senha' />

          <Input type="password" name="passwordConfirmation" placeholder='Repita sua senha' />

          <button type="submit" disabled={hasError()} data-testid="submit" className={Styles.submit}>Cadastrar</button>
          <Link replace data-testid="signup" to="/login" className={Styles.link}>Voltar para login</Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

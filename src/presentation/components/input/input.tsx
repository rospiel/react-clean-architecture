import React, { useContext } from 'react'
import Styles from './input-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export default function Input (props: InputProps): React.ReactElement {
  const { state, setState } = useContext(Context)
  const message = state[`${props.name}Error`]

  function getStatus (): string {
    return message ? '🔴' : '🟢'
  }

  function getMessageTooltip (): string {
    return message || 'Tudo certo'
  }

  function enableInput (event: React.FocusEvent<HTMLInputElement>): void {
    event.target.readOnly = false
  }

  function handleChange (event: React.FocusEvent<HTMLInputElement>): void {
    const name = event.target.name
    const value = event.target.value

    setState(prevState =>({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <div className={Styles.container}>
      <input data-testid={props.name} readOnly onFocus={enableInput} className={Styles.container__input} {...props} onChange={handleChange} />
      <span data-testid={`${props.name}-status`} className={Styles.container__status} title={getMessageTooltip()} >{getStatus()}</span>
    </div>
  )
}

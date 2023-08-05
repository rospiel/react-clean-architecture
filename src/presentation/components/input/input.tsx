import React from 'react'
import Styles from './input-styles.scss'

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export default function Input (props: InputProps): React.ReactElement {
  function enableInput (event: React.FocusEvent<HTMLInputElement>): void {
    event.target.readOnly = false
  }

  return (
    <div className={Styles.container}>
      <input readOnly onFocus={enableInput} className={Styles.container__input} {...props} />
      <span className={Styles.container__status}>🔴</span>
    </div>
  )
}

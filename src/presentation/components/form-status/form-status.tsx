import React from 'react'
import Styles from './form-status-styles.scss'
import Spinner from '@/presentation/components/spinner/spinner'

export default function FormStatus (): React.ReactElement {
  return (
    <div className={Styles.container}>
      <Spinner className={Styles.container__spinner} />
      <span className={Styles.container__message}>Erro</span>
    </div>
  )
}

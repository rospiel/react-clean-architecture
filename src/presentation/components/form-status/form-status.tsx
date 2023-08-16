import React, { useContext } from 'react'
import Styles from './form-status-styles.scss'
import Spinner from '@/presentation/components/spinner/spinner'
import Context from '@/presentation/contexts/form/form-context'

export default function FormStatus (): React.ReactElement {
  const { state } = useContext(Context)

  return (
    <div data-testid="error-container" className={Styles.container}>
      { state.isLoading && <Spinner className={Styles.container__spinner} /> }
      { state.message && <span data-testid="error-message" className={Styles.container__message}>{state.message}</span> }
    </div>
  )
}

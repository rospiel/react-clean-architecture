import React from 'react'
import Styles from './error-styles.scss'

type ErrorProps = {
    message: string
    reload: () => void 
}

export default function Error ({ message, reload }: ErrorProps): JSX.Element {
    return (
        <div className={Styles.errorContainer}>
            <span className={Styles.errorContainer__errorSpan} data-testid="error">{message}</span>
            <button data-testid="reload" onClick={reload}>Recarregar</button>
        </div>
    )
}
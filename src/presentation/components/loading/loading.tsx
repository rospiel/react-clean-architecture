import React from 'react'
import Styles from './loading-styles.scss'
import Spinner from '@/presentation/components/spinner/spinner'

export default function Loading (): JSX.Element {
    return (
        <div data-testid="loading" className={Styles.loadingContainer}>
            <div className={Styles.loadingContainer__div}>
                <span className={Styles.loadingContainer__span}>Aguarde...</span>
                <Spinner isNegative />
            </div>
        </div>
    )
}
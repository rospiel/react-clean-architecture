import React, { memo } from 'react'
import Styles from './header-styles.scss'
import { Logo } from '@/presentation/components'


export default function Header (): JSX.Element {
    return (
        <header className={Styles.surveyContainer__header}>
            <div className={Styles.surveyContainer__headerContent}>
                <Logo />
                <div className={Styles.surveyContainer__headerLogout}>
                    <span>Santos</span>
                    <a href="#">Sair</a>
                </div>
            </div>
        </header>
    )
}
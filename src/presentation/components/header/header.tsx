import React, { useContext } from 'react'
import Styles from './header-styles.scss'
import { Logo } from '@/presentation/components'
import { useHistory } from 'react-router'
import apiContext from '@/presentation/contexts/api/api-context'


export default function Header (): JSX.Element {
    const history = useHistory()
    const { setCurrentAccount, getCurrentAccount } = useContext(apiContext)

    function logout (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void {
        event.preventDefault()
        setCurrentAccount(undefined)
        history.replace('/login')
    }
    
    return (
        <header className={Styles.surveyContainer__header}>
            <div className={Styles.surveyContainer__headerContent}>
                <Logo />
                <div className={Styles.surveyContainer__headerLogout}>
                    <span data-testid="username">{getCurrentAccount().name}</span>
                    <a data-testid="logout" onClick={logout} href="#">Sair</a>
                </div>
            </div>
        </header>
    )
}
import React, { useContext } from 'react'
import Styles from './header-styles.scss'
import { Logo } from '@/presentation/components'
import useLogout from '@/presentation/hooks/use-logout'
import { useRecoilValue } from 'recoil'
import { currentAccountState } from '../atoms/atoms'


export default function Header (): JSX.Element {
    const logout = useLogout()
    const { getCurrentAccount } = useRecoilValue(currentAccountState)

    function handleLogout (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void {
        event.preventDefault()
        logout()
    }

    if (!(getCurrentAccount()?.accessToken)) {
        logout()
        return;
    }
    
    return (
        <header className={Styles.surveyContainer__header}>
            <div className={Styles.surveyContainer__headerContent}>
                <Logo />
                <div className={Styles.surveyContainer__headerLogout}>
                    <span data-testid="username">{getCurrentAccount().name}</span>
                    <a data-testid="logout" onClick={handleLogout} href="#">Sair</a>
                </div>
            </div>
        </header>
    )
}
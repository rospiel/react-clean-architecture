import React, { memo } from 'react'
import Logo from '@/presentation/components/logo/logo'
import Styles from './login-header-styles.scss'

const LoginHeader: React.FC = (): React.ReactElement => {
  return (
    <header className={Styles.header}>
      <Logo />
      <h1 className={Styles.header__h1}>4Dev - Enquetes para Programadores</h1>
    </header>
  )
}

export default memo(LoginHeader)

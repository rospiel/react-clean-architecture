import React, { memo } from 'react'
import Styles from './footer-styles.scss'

const Footer: React.FC = (): React.ReactElement => {
  return (
    <footer className={Styles.footer}></footer>
  )
}

export default memo(Footer)

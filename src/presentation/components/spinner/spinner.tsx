import React from 'react'
import Styles from './spinner-styles.scss'

type SpinnerProps = React.HTMLAttributes<HTMLElement>

export default function Spinner (props: SpinnerProps): JSX.Element {
  const classes: string = [Styles.spinner, props.className].join(' ')

  return (
    <div {...props} className={classes}>
      <div /><div /><div /><div />
    </div>
  )
}

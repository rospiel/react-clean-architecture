import React from 'react'
import Styles from './spinner-styles.scss'

type SpinnerProps = React.HTMLAttributes<HTMLElement> & {
  isNegative?: boolean
}

export default function Spinner ({ isNegative, ...props }: SpinnerProps): JSX.Element {
  const negativeClass = isNegative ? Styles.negative : ''
  const classes: string = [Styles.spinner, props.className, negativeClass].join(' ')

  return (
    <div data-testid="spinner" {...props} className={classes}>
      <div /><div /><div /><div />
    </div>
  )
}

import React from 'react'
import Styles from './calendar-styles.scss'

type CalendarProps = {
    date: Date
    className?: string
}

export default function Calendar ({ date, className }: CalendarProps): JSX.Element {
    return (
        <time className={[Styles.calendarContainer, className].join(' ')}>
            <span data-testid="day" className={Styles.calendarContainer__day}>{date.getDate().toString().padStart(2, '0')}</span>
            <span data-testid="month" className={Styles.calendarContainer__month}>{date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}</span>
            <span data-testid="year" className={Styles.calendarContainer__year}>{date.getFullYear()}</span>
        </time>
    )
}
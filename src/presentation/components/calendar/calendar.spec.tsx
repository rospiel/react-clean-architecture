import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { Calendar, IconType } from '@/presentation/components'
import faker from 'faker'

function makeSut (date: Date): void {
    render(
        <Calendar date={date} />
    )
}

describe('Calendar component', function () {
    test('Should render date formated', async function () {
        const date = faker.date.recent()
        makeSut(date)
        
        expect(screen.getByTestId('day')).toHaveTextContent(date.getDate().toString().padStart(2, '0'))
        expect(screen.getByTestId('month')).toHaveTextContent(date.toLocaleString('pt-BR', { month: 'short' }).replace('.', ''))
        expect(screen.getByTestId('year')).toHaveTextContent(String(date.getFullYear()))
    })

    test('Should render date formated when first week', async function () {
        const date = new Date('2025-01-01T00:00:00')
        makeSut(date)
        
        expect(screen.getByTestId('day')).toHaveTextContent(date.getDate().toString().padStart(2, '0'))
        expect(screen.getByTestId('month')).toHaveTextContent(date.toLocaleString('pt-BR', { month: 'short' }).replace('.', ''))
        expect(screen.getByTestId('year')).toHaveTextContent(String(date.getFullYear()))
    })
})
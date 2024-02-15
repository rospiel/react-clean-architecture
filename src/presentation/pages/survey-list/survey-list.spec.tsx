import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import SurveyList from './survey-list'
import { LoadSurveyListSpy, mockAccountModel, mockSurveyListModel, mockSurveyModel } from '@/domain/test'
import { IconType } from '@/presentation/components'
import faker from 'faker'
import { UnexpectedError, AccessDeniedError } from '@/domain/errors'
import ApiContext from '@/presentation/contexts/api/api-context'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { AccountModel } from '@/domain/models'

type SutTypes = {
    loadSurveyListSpy: LoadSurveyListSpy
    history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

function makeSut (loadSurveyListSpy: LoadSurveyListSpy = new LoadSurveyListSpy()): SutTypes {
    const history = createMemoryHistory({ initialEntries: ['/'] })
    const setCurrentAccountMock = jest.fn()
    
    render(
        <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, 
                                      getCurrentAccount: () => mockAccountModel()  }}>
            <Router history={history}>
                <SurveyList loadSurveyList={loadSurveyListSpy} />
            </Router>
        </ApiContext.Provider>
    )
    return {
        history, 
        setCurrentAccountMock,
        loadSurveyListSpy
    }
}

describe('SurveyList component', function () {
    test('Should call LoadSurveyList', async function () {
        const { loadSurveyListSpy } = makeSut()
        expect(loadSurveyListSpy.callsCount).toBe(1)
        /* wait for the element header on page */
        await waitFor(() => screen.getByRole('heading'))
    })

    test('Should render with correct value when answer', async function () {
        const date = faker.date.recent()
        const survey = Object.assign(mockSurveyModel(), {
            didAnswer: true,
            date: date
        })

        let loadSurveyListSpy = new LoadSurveyListSpy()
        loadSurveyListSpy.surveys = [survey]
        makeSut(loadSurveyListSpy)
        

        const surveyList = screen.getByTestId('survey-list')
        await waitFor(() => surveyList)
        expect(surveyList.querySelectorAll('li')).toHaveLength(loadSurveyListSpy.surveys.length)
        expect(surveyList.querySelector('[data-testid="day"]')).toHaveTextContent(date.getDate().toString().padStart(2, '0'))
        expect(surveyList.querySelector('[data-testid="month"]')).toHaveTextContent(date.toLocaleString('pt-BR', { month: 'short' }).replace('.', ''))
        expect(surveyList.querySelector('[data-testid="year"]')).toHaveTextContent(String(date.getFullYear()))
        expect(surveyList.querySelector('[data-testid="question"]')).toHaveTextContent(String(survey.question))
        expect(surveyList.querySelector('[data-testid="icon"]')).toHaveAttribute('src', IconType.thumbUp)
        expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    })

    test('Should render with correct value when not answer', async function () {
        const survey = Object.assign(mockSurveyModel(), {
            didAnswer: false
        })

        let loadSurveyListSpy = new LoadSurveyListSpy()
        loadSurveyListSpy.surveys = [survey]
        makeSut(loadSurveyListSpy)

        const surveyList = screen.getByTestId('survey-list')
        await waitFor(() => surveyList)
        expect(surveyList.querySelector('[data-testid="icon"]')).toHaveAttribute('src', IconType.thumbDown)
        expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    })

    test('Should show error message on UnexpectedError', async function () {
        const loadSurveyListSpy = new LoadSurveyListSpy()
        const error = new UnexpectedError()
        jest.spyOn(loadSurveyListSpy, 'all').mockRejectedValueOnce(error)
        makeSut(loadSurveyListSpy)
        await waitFor(() => screen.getByRole('heading'))
        expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
        expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    })

    test('Should show error message on AccessDeniedError', async function () {
        const loadSurveyListSpy = new LoadSurveyListSpy()
        const error = new AccessDeniedError()
        jest.spyOn(loadSurveyListSpy, 'all').mockRejectedValueOnce(error)
        const { setCurrentAccountMock, history } = makeSut(loadSurveyListSpy)
        await waitFor(() => screen.getByRole('heading'))
        expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
        expect(history.location.pathname).toBe('/login')
    })

    test('Should call again when requested reload', async function () {
        const loadSurveyListSpy = new LoadSurveyListSpy()
        jest.spyOn(loadSurveyListSpy, 'all').mockRejectedValueOnce(new UnexpectedError())
        makeSut(loadSurveyListSpy)
        await waitFor(() => screen.getByRole('heading'))
        fireEvent.click(screen.getByTestId('reload'))
        expect(loadSurveyListSpy.callsCount).toBe(1)
        await waitFor(() => screen.getByRole('heading'))
    })
})
import { mockAccountModel } from "@/domain/test"
import ApiContext from "@/presentation/contexts/api/api-context"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from 'react'
import SurveyResult from "./survey-result"
import { LoadSurveyResultSpy, mockSurveyResultModel } from "@/domain/test/mock-survey-result"
import faker from 'faker'
import { AccessDeniedError, UnexpectedError } from "@/domain/errors"
import { createMemoryHistory, MemoryHistory } from 'history'
import { AccountModel } from "@/domain/models"
import { Router } from "react-router-dom"

type SutTypes = {
    loadSurveyResultSpy: LoadSurveyResultSpy
    history: MemoryHistory
    setCurrentAccountMock: (account: AccountModel) => void
}

function makeSut (loadSurveyResultSpy = new LoadSurveyResultSpy()): SutTypes {
    const history = createMemoryHistory({ initialEntries: ['/', '/surveys/id'], initialIndex: 1 })
    const setCurrentAccountMock = jest.fn()
    
    render(
        <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, 
            getCurrentAccount: () => mockAccountModel()  }}>
            <Router history={history}>
                <SurveyResult loadSurveyResult={loadSurveyResultSpy} />
            </Router>
        </ApiContext.Provider>
    )

    return {
        loadSurveyResultSpy,
        history, 
        setCurrentAccountMock
    }
}

describe('SurveyResult Component', function () {
    test('Should render with initial state', async function () {
        makeSut()

        const surveyResult = screen.getByTestId('survey-result')
        expect(surveyResult.childElementCount).toBe(0)
        expect(screen.queryByTestId('error')).not.toBeInTheDocument()
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
        await waitFor(() => surveyResult)
    })

    test('Should call LoadSurveyResult', async function () {
        const { loadSurveyResultSpy } = makeSut() 
        await waitFor(() => screen.getByTestId('survey-result'))
        expect(loadSurveyResultSpy.callsCount).toBe(1)
    })

    test('Should render SurveyResult when success', async function () {
        const loadSurveyResultSpy = new LoadSurveyResultSpy()
        const date = faker.date.recent()
        const surveyResult = Object.assign(mockSurveyResultModel(), {
            date
        })
        loadSurveyResultSpy.surveyResultModel = surveyResult
        makeSut(loadSurveyResultSpy)

        await waitFor(() => screen.getByTestId('survey-result'))
        expect(screen.getByTestId('day')).toHaveTextContent(date.getDate().toString().padStart(2, '0'))
        expect(screen.getByTestId('month')).toHaveTextContent(date.toLocaleString('pt-BR', { month: 'short' }).replace('.', ''))
        expect(screen.getByTestId('year')).toHaveTextContent(String(date.getFullYear()))
        expect(screen.getByTestId('question')).toHaveTextContent(surveyResult.question)
        expect(screen.getByTestId('answers').childElementCount).toBe(surveyResult.answers.length)
        
        const answers = screen.getAllByTestId('answer-container')
        expect(answers[0]).toHaveClass('surveyResultContainer__content_li_active')
        expect(answers[1]).not.toHaveClass('surveyResultContainer__content_li_active')
        
        const images = screen.getAllByTestId('image')
        expect(images[0]).toHaveAttribute('src', surveyResult.answers[1].image)
        expect(images[0]).toHaveAttribute('alt', surveyResult.answers[1].answer)
        
        expect(screen.getAllByTestId('image').length).toBe(1)
        
        expect(screen.getAllByTestId('answer')[0]).toHaveTextContent(surveyResult.answers[0].answer)
        expect(screen.getAllByTestId('percent')[0]).toHaveTextContent(`${surveyResult.answers[0].percent}%`)
        
    })

    test('Should show error message on UnexpectedError', async function () {
        const loadSurveyResultSpy = new LoadSurveyResultSpy()
        const error = new UnexpectedError()
        jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(error)
        makeSut(loadSurveyResultSpy)
        await waitFor(() => screen.getByTestId('survey-result'))
        expect(screen.queryByTestId('question')).not.toBeInTheDocument()
        expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    })

    test('Should show error message on AccessDeniedError', async function () {
        const loadSurveyResultSpy = new LoadSurveyResultSpy()
        const error = new AccessDeniedError()
        jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(error)
        const { setCurrentAccountMock, history } = makeSut(loadSurveyResultSpy)
        await waitFor(() => screen.getByTestId('survey-result'))
        expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
        expect(history.location.pathname).toBe('/login')
    })

    test('Should call again when requested reload', async function () {
        const loadSurveyResultSpy = new LoadSurveyResultSpy()
        jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(new UnexpectedError())
        makeSut(loadSurveyResultSpy)
        await waitFor(() => screen.getByTestId('survey-result'))
        fireEvent.click(screen.getByTestId('reload'))
        expect(loadSurveyResultSpy.callsCount).toBe(1)
        await waitFor(() => screen.getByTestId('survey-result'))
    })

    test('Should redirect to previous page when click to go back', async function () {
        const { history } = makeSut()
        await waitFor(() => screen.getByTestId('survey-result'))
        fireEvent.click(screen.getByTestId('back-button'))
        expect(history.location.pathname).toBe('/')
    })
    
})
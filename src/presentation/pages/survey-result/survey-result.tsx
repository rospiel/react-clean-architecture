import React, { useEffect, useState } from 'react'
import Styles from './survey-result-styles.scss'
import { Calendar, Error, Header, Spinner } from '@/presentation/components'
import Footer from '@/presentation/components/footer/footer'
import Loading from '@/presentation/components/loading/loading'
import { LoadSurveyResultModel } from '@/domain/models'
import { LoadSurveyResult } from '@/domain/usecases'
import useErrorHandler from '@/presentation/hooks/use-error-handler'
import { useNavigate, useParams } from 'react-router-dom'

type StateProps = {
    isLoading: boolean
    error: string 
    surveyResult: LoadSurveyResultModel
    reload: boolean
}

type SurveyResultProps = {
    loadSurveyResult: LoadSurveyResult
}

function initialStateProps (reload: boolean = false): StateProps {
    return {
        isLoading: false, 
        error: '', 
        surveyResult: null as LoadSurveyResultModel, 
        reload
    }
}

export default function SurveyResult ({ loadSurveyResult }: SurveyResultProps): JSX.Element {
    const [state, setState] = useState<StateProps>(initialStateProps)
    const handleError = useErrorHandler({ callback })
    const navigate = useNavigate()
    const { id } = useParams()
    
    useEffect(() => {
        loadSurveyResult.load(id)
        .then(response => {
            setState(prevState => ({
                ...prevState, surveyResult: response
            }))
        })
        .catch(handleError)
    }, [state.reload])


    function handleReload (): void {
        setState(initialStateProps(true))
    }

    function callback (error: Error): void {
        setState(prevState => ({ ...prevState, surveyResult: null, reload: false, error: error.message }))
    }

    function getStyleBy (isCurrentAccountAnswer: boolean): string {
        return isCurrentAccountAnswer ? Styles.surveyResultContainer__content_li_active : ''
    }

    function buildBaseComponent (body: JSX.Element): JSX.Element {
        return (
            <div className={Styles.surveyResultContainer}>
                <Header />
                <div data-testid="survey-result" className={Styles.surveyResultContainer__content}>
                    {body}
                </div>
                <Footer />
            </div>
        )

    }

    function buildBodyComponent (): JSX.Element {
        return (
             <>
                <hgroup className={Styles.surveyResultContainer__hgroup}>
                    <Calendar date={state.surveyResult.date} className={Styles.surveyResultContainer__hgroup__calendar} />
                    <h2 data-testid="question" className={Styles.surveyResultContainer__hgroup__h2}>{state.surveyResult.question}</h2>
                </hgroup>
                
                <ul data-testid="answers" className={Styles.surveyResultContainer__content_list}>
                    {
                        state.surveyResult.answers.map(value =>
                            <li data-testid="answer-container" key={value.answer} className={[Styles.surveyResultContainer__content_li, getStyleBy(value.isCurrentAccountAnswer)].join(' ')}>
                                { value.image && 
                                    <img data-testid="image" className={Styles.surveyResultContainer__content_li_img} src={value.image} alt={value.answer} /> }
                                
                                <span data-testid="answer" className={Styles.surveyResultContainer__content_li_answer}>{value.answer}</span>
                                <span data-testid="percent" className={Styles.surveyResultContainer__content_li_percent}>{value.percent}%</span>
                            </li>
                        )
                    }
                    
                </ul>
                <button data-testid="back-button" className={Styles.surveyResultContainer__content_button} onClick={() => navigate(-1)}>Voltar</button> 
                    
                { state.isLoading && <Loading /> }
            </>
        )
    }

    

    if (state.error) {
        return (
            buildBaseComponent(<Error message={state.error} reload={handleReload} />)
        )
    }

    if (!state.surveyResult) {
        return (
            buildBaseComponent(<></>)
        )
    }

    return (
        buildBaseComponent(buildBodyComponent())
    )
}
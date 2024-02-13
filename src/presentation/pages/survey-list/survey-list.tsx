import React, { useContext, useEffect, useState } from 'react'
import Styles from './survey-list-styles.scss'
import { Header, Icon, IconType, Logo } from '@/presentation/components'
import Footer from '@/presentation/components/footer/footer'
import { LoadSurveyList } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'
import { useHistory } from 'react-router'
import apiContext from '@/presentation/contexts/api/api-context'
import { AccessDeniedError } from '@/domain/errors'

type SurveyListProps = {
    loadSurveyList: LoadSurveyList
}

export default function SurveyList (props: SurveyListProps): JSX.Element {
    const history = useHistory()
    const { setCurrentAccount } = useContext(apiContext)
    const [state, setState] = useState({
        surveys: [] as SurveyModel[], 
        error: '', 
        reload: false
    })
    
    useEffect(() => {
        props.loadSurveyList.all()
            .then(surveys => setState({ ...state, surveys }))
            .catch(error => {
                if (error instanceof AccessDeniedError) {
                    setCurrentAccount(undefined)
                    history.replace('/login')
                    return
                }

                setState({ ...state, error: error.message })

            })
        
    }, [state.reload])

    function setupIcon (survey: SurveyModel): IconType {
        return survey.didAnswer ? IconType.thumbUp : IconType.thumbDown
    }

    function handleReload (): void {
        setState({
            surveys: [],
            error: '',
            reload: !state.reload
        })
    }

    function buildBaseComponent (body: JSX.Element): JSX.Element {
        return (
            <div className={Styles.surveyContainer}>
                <Header />
                <main className={Styles.surveyContainer__contentContainer}>
                    <h2>Enquetes</h2>
                    {body}
                </main>
                <Footer />
            </div>
        )

    }

    function buildErrorComponent (): JSX.Element {
        return (
            <div className={Styles.surveyContainer__error}>
                <span className={Styles.surveyContainer__errorSpan} data-testid="error">{state.error}</span>
                <button data-testid="reload" onClick={handleReload}>Recarregar</button>
            </div>
        )

    }

    function buildBodyComponent (): JSX.Element {
        return (
            <ul data-testid="survey-list">
                {   
                    state.surveys.map((survey: SurveyModel) => {
                        return (
                            <li key={survey.id}>
                                <div className={Styles.contentContainer__content}>
                                    <Icon iconType={setupIcon(survey)} className={Styles.contentContainer__iconContainer} />
                                    <time>
                                        <span data-testid="day" className={Styles.day}>{survey.date.getDate().toString().padStart(2, '0')}</span>
                                        <span data-testid="month" className={Styles.month}>{survey.date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                                        <span data-testid="year" className={Styles.year}>{survey.date.getFullYear()}</span>
                                    </time>
                                    <p data-testid="question">{survey.question}</p>
                                </div>
                                <div className={Styles.contentContainer__result}>
                                    Ver Resultado
                                </div>
                            </li>
                        )
                    })
                }
                
            </ul>
        )

    }

    if (state.error) {
        return (
            buildBaseComponent(buildErrorComponent())
        )
    }

    return (
        buildBaseComponent(buildBodyComponent())
    )
}
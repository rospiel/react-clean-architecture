import React, { useContext, useEffect, useState } from 'react'
import Styles from './survey-list-styles.scss'
import { Calendar, Header, Icon, IconType, Logo } from '@/presentation/components'
import Footer from '@/presentation/components/footer/footer'
import { LoadSurveyList } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'
import useErrorHandler from '@/presentation/hooks/use-error-handler'
import Error from '@/presentation/components/error/error'
import { Link } from 'react-router-dom'


type SurveyListProps = {
    loadSurveyList: LoadSurveyList
}

export default function SurveyList (props: SurveyListProps): JSX.Element {
    const handleError = useErrorHandler({ callback })
    const [state, setState] = useState({
        surveys: [] as SurveyModel[], 
        error: '', 
        reload: false
    })
    
    useEffect(() => {
        props.loadSurveyList.all()
            .then(surveys => setState(prevState => ({ ...prevState, surveys })))
            .catch(handleError)

    }, [state.reload])

    function callback (error: Error): void {
        setState(prevState => ({ ...prevState, reload: false, error: error.message }))
    }

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
            <div data-testid="survey-list-page" className={Styles.surveyContainer}>
                <Header />
                <main className={Styles.surveyContainer__contentContainer}>
                    <h2>Enquetes</h2>
                    {body}
                </main>
                <Footer />
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
                                    <Calendar date={survey.date} className={Styles.contentContainer__calendar} />
                                    <p data-testid="question">{survey.question}</p>
                                </div>
                                <div className={Styles.contentContainer__result}>
                                    <Link data-testid="link" to={`/surveys/${survey.id}`}>
                                        Ver Resultado
                                    </Link>
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
            buildBaseComponent(<Error message={state.error} reload={handleReload} />)
        )
    }

    return (
        buildBaseComponent(buildBodyComponent())
    )
}
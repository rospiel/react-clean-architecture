import SurveyList from '@/presentation/pages/survey-list/survey-list'
import React from 'react'
import makeRemoteLoadSurveyList from '../../usecases/load-survey-list/remote-load-survey-list-factory'

export default function makeSurveyList (): JSX.Element {
    return (
        <SurveyList loadSurveyList={makeRemoteLoadSurveyList()} />
    )
}
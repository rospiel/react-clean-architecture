import { SurveyResult } from "@/presentation/pages"
import { useParams } from "react-router-dom"
import makeRemoteLoadSurveyResult from "../../usecases/load-survey-result/remote-load-survey-result-factory"
import React from 'react'

export default function makeSurveyResult (): JSX.Element {
    return (
        <SurveyResult loadSurveyResult={makeRemoteLoadSurveyResult()} />
    )
}
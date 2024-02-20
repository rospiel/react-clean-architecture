export type LoadSurveyResultModel = {
    surveyId: string
    question: string
    answers: AnswerResultModel[]
    date: Date
}

export type AnswerResultModel = {
    image?: string
    answer: string
    count: number
    percent: number
    isCurrentAccountAnswer: boolean
}
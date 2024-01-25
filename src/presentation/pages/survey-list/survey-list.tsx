import React from 'react'
import Styles from './survey-list-styles.scss'
import { Header, Icon, IconType, Logo } from '@/presentation/components'
import Footer from '@/presentation/components/footer/footer'

export default function SurveyList (): JSX.Element {
    
    
    return (
        <div className={Styles.surveyContainer}>
            <Header />
            <main className={Styles.surveyContainer__contentContainer}>
                <h2>Enquetes</h2>
                <ul>
                    <li>
                        <div className={Styles.contentContainer__content}>
                           <Icon iconType={IconType.thumbUp} className={Styles.contentContainer__iconContainer} />
                            <time>
                                <span className={Styles.day}>22</span>
                                <span className={Styles.month}>03</span>
                                <span className={Styles.year}>2020</span>
                            </time>
                            <p>Qual é seu framework web favorito?</p>
                        </div>
                        <div className={Styles.contentContainer__result}>
                            Ver Resultado
                        </div>
                    </li>
                    <li>
                        <div className={Styles.contentContainer__content}>
                           <Icon iconType={IconType.thumbUp} className={Styles.contentContainer__iconContainer} />
                            <time>
                                <span className={Styles.day}>22</span>
                                <span className={Styles.month}>03</span>
                                <span className={Styles.year}>2020</span>
                            </time>
                            <p>Qual é seu framework web favorito?</p>
                        </div>
                        <div className={Styles.contentContainer__result}>
                            Ver Resultado
                        </div>
                    </li>
                    <li>
                        <div className={Styles.contentContainer__content}>
                           <Icon iconType={IconType.thumbUp} className={Styles.contentContainer__iconContainer} />
                            <time>
                                <span className={Styles.day}>22</span>
                                <span className={Styles.month}>03</span>
                                <span className={Styles.year}>2020</span>
                            </time>
                            <p>Qual é seu framework web favorito?</p>
                        </div>
                        <div className={Styles.contentContainer__result}>
                            Ver Resultado
                        </div>
                    </li>
                    <li>
                        <div className={Styles.contentContainer__content}>
                           <Icon iconType={IconType.thumbUp} className={Styles.contentContainer__iconContainer} />
                            <time>
                                <span className={Styles.day}>22</span>
                                <span className={Styles.month}>03</span>
                                <span className={Styles.year}>2020</span>
                            </time>
                            <p>Qual é seu framework web favorito?</p>
                        </div>
                        <div className={Styles.contentContainer__result}>
                            Ver Resultado
                        </div>
                    </li>
                    <li>
                        <div className={Styles.contentContainer__content}>
                           <Icon iconType={IconType.thumbUp} className={Styles.contentContainer__iconContainer} />
                            <time>
                                <span className={Styles.day}>22</span>
                                <span className={Styles.month}>03</span>
                                <span className={Styles.year}>2020</span>
                            </time>
                            <p>Qual é seu framework web favorito?</p>
                        </div>
                        <div className={Styles.contentContainer__result}>
                            Ver Resultado
                        </div>
                    </li>
                    <li>
                        <div className={Styles.contentContainer__content}>
                           <Icon iconType={IconType.thumbUp} className={Styles.contentContainer__iconContainer} />
                            <time>
                                <span className={Styles.day}>22</span>
                                <span className={Styles.month}>03</span>
                                <span className={Styles.year}>2020</span>
                            </time>
                            <p>Qual é seu framework web favorito?</p>
                        </div>
                        <div className={Styles.contentContainer__result}>
                            Ver Resultado
                        </div>
                    </li>
                    <li>
                        <div className={Styles.contentContainer__content}>
                           <Icon iconType={IconType.thumbUp} className={Styles.contentContainer__iconContainer} />
                            <time>
                                <span className={Styles.day}>22</span>
                                <span className={Styles.month}>03</span>
                                <span className={Styles.year}>2020</span>
                            </time>
                            <p>Qual é seu framework web favorito?</p>
                        </div>
                        <div className={Styles.contentContainer__result}>
                            Ver Resultado
                        </div>
                    </li>
                    <li>
                        <div className={Styles.contentContainer__content}>
                           <Icon iconType={IconType.thumbUp} className={Styles.contentContainer__iconContainer} />
                            <time>
                                <span className={Styles.day}>22</span>
                                <span className={Styles.month}>03</span>
                                <span className={Styles.year}>2020</span>
                            </time>
                            <p>Qual é seu framework web favorito?</p>
                        </div>
                        <div className={Styles.contentContainer__result}>
                            Ver Resultado
                        </div>
                    </li>
                    
                </ul>
            </main>
            <Footer />
        </div>
    )
}
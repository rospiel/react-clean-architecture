import { test, expect } from "@playwright/experimental-ct-react"
import { buildAccount, buildSurveyList } from "./data/mock-data"


const thumbDown = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFKADAAQAAAABAAAAEgAAAAA9nQVdAAAA70lEQVQ4Ea2RPQoCQQyFZ/w5g72lYOEVPIiV2IkIHmCvIZ5D77BgZWtrYWe1ICiuL8tEwjIZZmYNZCf7knyTzRrjrK7rAfwAr+AheyNZwiei98gNrBkISxYjz5KbZb0V4gXxlN8jzo+1tk91BOT6nhPmOFNg1Nb0UiCNxY0Uu8QW044BuMIZHs3DJzcra3/yOgem3UoT3pEcaQUh3TchAX9/KNTsy/mAtLebrzhXI+AqE/oQl55ErIfYxp5WothW71QyAJ0VWKG06DJAQ/jTA0yH0TUAzf4Gc8BFC5g3GcHI3IQvBy0asesDsB08CfYFB/44kX6+Hj8AAAAASUVORK5CYII='
const thumbUp = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFKADAAQAAAABAAAAEgAAAAA9nQVdAAAA0klEQVQ4EWNgIAH8//+/AYhLSNCCWynUMCD1/zcQG+BWSYQMkmEgA0Egjght2JUANYO8iQ4MsasmIAo0BZthP4DirAS0YkrjMAzk0tOYqgmIADUVgnTiADPxakfStAWmECj2DkmcWOYjoEJPRpBqmEGMQABiI4vB5IikH1PbQAYmIm0mVtlLahu4nJpe/gf0hho1XbgVGKd3qWngRFBA4/LyX6AcKZZdBbpOB2QgLk1nQJIkgElwtaBEDAXIOUULKHYSiP/CJHHQX4Hic4CYBWYgADx8PyqFiuhJAAAAAElFTkSuQmCC'


test.beforeEach(async function ({ page }, testInfo) {
    await page.evaluate(() => {  
        localStorage.setItem('account', '{ "accessToken": "accessToken", "name": "name" }')
    })
    
    await page.goto('')
})

test('Should render error when throw UnexpectedError but if try again should render', async function ({ page }) {
    await page.route('http://localhost:5050/api/surveys', async route => {
        await route.fulfill({
            status: 500, 
            contentType: 'application/json', 
            json: 'error'

        })
    })  
    await expect(page.getByTestId('error')).toHaveText('Instabilidade no sistema. Tente novamente em breve.')

    await page.route('http://localhost:5050/api/surveys', async route => {
        await route.fulfill({
            status: 200, 
            contentType: 'application/json',
            json: buildSurveyList()
        })
    })  

    
    await page.getByTestId('reload').click()
    await expect(page.getByRole('listitem')).toHaveCount(2)
})

test('Should logout when throw AccessDeniedError', async function ({ page }) {
    await page.route('http://localhost:5050/api/surveys', async route => {
        await route.fulfill({
            status: 403, 
            contentType: 'application/json', 
            json: 'error'

        })
    })  
    
    await expect(page).toHaveURL('/login')
})

test('Should render success', async function ({ page }) {
    const surveyList = buildSurveyList()
    await page.route('http://localhost:5050/api/surveys', async route => {
        await route.fulfill({
            status: 200, 
            contentType: 'application/json',
            json: surveyList
        })
    })  
    
    const value = await page.evaluate(() => localStorage.getItem('account'))
    await expect(page.getByTestId('username')).toHaveText(JSON.parse(value as string).name)
    
    await expect(page.getByTestId('question').first()).toHaveText(surveyList[0]['question'])
    await expect(page.getByTestId('question').last()).toHaveText(surveyList[1]['question'])
    await expect(page.getByTestId('day').first()).toHaveText(new Date(surveyList[0]['date']).getDate().toString())
    await expect(page.getByTestId('day').last()).toHaveText(new Date(surveyList[1]['date']).getDate().toString())
    await expect(page.getByTestId('month').first()).toHaveText(new Date(surveyList[0]['date']).toLocaleString('pt-BR', { month: 'short' }).replace('.', ''))
    await expect(page.getByTestId('month').last()).toHaveText(new Date(surveyList[1]['date']).toLocaleString('pt-BR', { month: 'short' }).replace('.', ''))
    await expect(page.getByTestId('year').first()).toHaveText(String(new Date(surveyList[0]['date']).getFullYear()))
    await expect(page.getByTestId('year').last()).toHaveText(String(new Date(surveyList[1]['date']).getFullYear()))
    await expect(page.getByTestId('icon').first()).toHaveAttribute('src', surveyList[0]['didAnswer'] ? thumbUp : thumbDown)
    await expect(page.getByTestId('icon').last()).toHaveAttribute('src', surveyList[1]['didAnswer'] ? thumbUp : thumbDown)
})

test('Should redirect to login when request logout', async function ({ page }) {
    const surveyList = buildSurveyList()
    await page.route('http://localhost:5050/api/surveys', async route => {
        await route.fulfill({
            status: 200, 
            contentType: 'application/json',
            json: surveyList
        })
    })  
    
    await page.getByTestId('logout').click()
    await expect(page).toHaveURL('/login')
})

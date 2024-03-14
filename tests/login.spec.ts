import { faker } from '@faker-js/faker'
import react from 'react'
import { test, expect } from '@playwright/experimental-ct-react'
import { buildAccount } from './data/mock-data'

const EMAIL_ELEMENT = 'email'
const EMAIL_STATUS_ELEMENT = 'email-status'
const PASSWORD_ELEMENT = 'password'
const PASSWORD_STATUS_ELEMENT = 'password-status'
const SUBMIT_ELEMENT = 'submit'
const ERROR_ELEMENT = 'error-container'

test.beforeEach(async ({ page }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 30000)
  await page.goto('login')
})

test('Should load with correct initial state', async ({ page }) => {
  await expect(page.getByTestId(`${EMAIL_ELEMENT}`)).toHaveAttribute('readonly')
  await expect(page.getByTestId(`${PASSWORD_ELEMENT}`)).toHaveAttribute('readonly')
  await expect(page.getByTestId(`${EMAIL_STATUS_ELEMENT}`)).toHaveAttribute('title', 'Campo obrigatório')
  await expect(page.getByTestId(`${EMAIL_STATUS_ELEMENT}`)).toHaveText('🔴')
  await expect(page.getByTestId(`${PASSWORD_STATUS_ELEMENT}`)).toHaveAttribute('title', 'Campo obrigatório')
  await expect(page.getByTestId(`${PASSWORD_STATUS_ELEMENT}`)).toHaveText('🔴')
  await expect(page.getByTestId(`${SUBMIT_ELEMENT}`)).toHaveAttribute('disabled')
  await expect(page.getByTestId(`${ERROR_ELEMENT}`)).toBeEmpty()
})

test('Should show error when form is invalid', async ({ page }) => {
  await page.getByTestId(`${EMAIL_ELEMENT}`).focus()
  await page.getByTestId(`${EMAIL_ELEMENT}`).fill(faker.string.alphanumeric(3))
  await expect(page.getByTestId(`${EMAIL_STATUS_ELEMENT}`)).toHaveAttribute('title', 'Valor inválido')
  await expect(page.getByTestId(`${EMAIL_STATUS_ELEMENT}`)).toHaveText('🔴')

  await page.getByTestId(`${PASSWORD_ELEMENT}`).focus()
  await page.getByTestId(`${PASSWORD_ELEMENT}`).fill(faker.string.alphanumeric(3))
  await expect(page.getByTestId(`${PASSWORD_STATUS_ELEMENT}`)).toHaveAttribute('title', 'Valor inválido')
  await expect(page.getByTestId(`${PASSWORD_STATUS_ELEMENT}`)).toHaveText('🔴')
})

test('Should allow submit when form is valid', async ({ page }) => {
  await page.getByTestId(`${EMAIL_ELEMENT}`).focus()
  await page.getByTestId(`${EMAIL_ELEMENT}`).fill(faker.internet.email())
  await expect(page.getByTestId(`${EMAIL_STATUS_ELEMENT}`)).toHaveAttribute('title', 'Tudo certo')
  await expect(page.getByTestId(`${EMAIL_STATUS_ELEMENT}`)).toHaveText('🟢')
  
  await page.getByTestId(`${PASSWORD_ELEMENT}`).focus()
  await page.getByTestId(`${PASSWORD_ELEMENT}`).fill(faker.string.alphanumeric(5))
  await expect(page.getByTestId(`${PASSWORD_STATUS_ELEMENT}`)).toHaveAttribute('title', 'Tudo certo')
  await expect(page.getByTestId(`${PASSWORD_STATUS_ELEMENT}`)).toHaveText('🟢')

  await expect(page.getByTestId(`${SUBMIT_ELEMENT}`)).not.toHaveAttribute('disabled')
  await expect(page.getByTestId(`${ERROR_ELEMENT}`)).toBeEmpty()
})

test('Should show error when credentials failed', async function ({ page }) {
  await page.route('http://localhost:5050/api/login', async route => {
    await route.fulfill({
      status: 401, 
      contentType: 'application/json',
      body: ''
    })
  })  

  await page.getByTestId(`${EMAIL_ELEMENT}`).focus()
  await page.getByTestId(`${EMAIL_ELEMENT}`).fill(faker.internet.email())
  
  await page.getByTestId(`${PASSWORD_ELEMENT}`).focus()
  await page.getByTestId(`${PASSWORD_ELEMENT}`).fill(faker.string.alphanumeric(5))
  
  await page.getByTestId(SUBMIT_ELEMENT).click()

  await expect(page.getByTestId('spinner')).toHaveCount(0)
  await expect(page.getByTestId('error-message')).toHaveText('Credenciais inválidas')
  await expect(page).toHaveURL('/login')
})

test('Should save account on local storage when credentials succeed ', async function ( {page} ) {
  const account = buildAccount()
  await page.route('http://localhost:5050/api/login', async route => {
    await route.fulfill({
        status: 200, 
        contentType: 'application/json',
        json: account
        
    })
  })  

  await page.getByTestId(`${EMAIL_ELEMENT}`).focus()
  await page.getByTestId(`${EMAIL_ELEMENT}`).fill(faker.internet.email())
  
  await page.getByTestId(`${PASSWORD_ELEMENT}`).focus()
  await page.getByTestId(`${PASSWORD_ELEMENT}`).fill(faker.string.alphanumeric(5))
  
  await page.getByTestId(SUBMIT_ELEMENT).click()

  await expect(page.getByTestId('spinner')).toHaveCount(0)
  await expect(page.getByTestId('error-message')).toHaveCount(0)
  await expect(page).toHaveURL('/')
  
  const value = await page.evaluate(() => localStorage.getItem('account'))
  await expect(value).toEqual(JSON.stringify(account))
  
})

test('Should not allowed multiple submits', async function ({ page }) {
  const account = buildAccount()
  let count = 0;
  await page.route('http://localhost:5050/api/login', async route => {
    count++  
    await route.fulfill({
        status: 200, 
        contentType: 'application/json',
        json: account
    })
  })  
  
  await page.getByTestId(`${EMAIL_ELEMENT}`).focus()
  await page.getByTestId(`${EMAIL_ELEMENT}`).fill(faker.internet.email())
  
  await page.getByTestId(`${PASSWORD_ELEMENT}`).focus()
  await page.getByTestId(`${PASSWORD_ELEMENT}`).fill(faker.string.alphanumeric(5))
  
  await page.getByTestId(SUBMIT_ELEMENT).dblclick()
  expect(count).toEqual(1)
})

test('Should not call external service when form is invalid', async function ({ page }) {
  const account = buildAccount()
  let count = 0;
  await page.route('http://localhost:5050/api/login', async route => {
    count++  
    await route.fulfill({
        status: 200, 
        contentType: 'application/json',
        json: account
    })
  })  
  
  await page.getByTestId(`${EMAIL_ELEMENT}`).focus()
  await page.getByTestId(`${EMAIL_ELEMENT}`).fill(faker.internet.email())
  await page.getByTestId(`${EMAIL_ELEMENT}`).press('Enter')
  expect(count).toEqual(0)
})


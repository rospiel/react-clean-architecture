import { fireEvent, screen } from '@testing-library/react'

export function testContainerChildCount (count: number, containerName: string): void {
  const container = screen.getByTestId(containerName)
  expect(container.childElementCount).toBe(count)
}

export function testButtonIsDisabled (fieldName: string, isDisabled: boolean): void {
  const button = screen.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

export function testStatusForField (fieldName: string, errorMessage?: string): void {
  const emailStatus = screen.getByTestId(fieldName.concat('-status'))
  expect(emailStatus.title).toBe(errorMessage || 'Tudo certo')
  expect(emailStatus.textContent).toBe(errorMessage ? '🔴' : '🟢')
}

export function populateInput (inputName: string, value: string): void {
  const input = screen.getByTestId(inputName)
  fireEvent.input(input, { target: { value: value } })
}

export function testElementExists (fieldName: string): void {
  const element = screen.getByTestId(fieldName)
  expect(element).toBeTruthy()
}

export function testElementText (fieldName: string, text: string): void {
  const element = screen.getByTestId(fieldName)
  expect(element.textContent).toBe(text)
}

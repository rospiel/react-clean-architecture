import { fireEvent, RenderResult } from '@testing-library/react'

export function testContainerChildCount (sut: RenderResult, count: number, containerName: string): void {
  const container = sut.getByTestId(containerName)
  expect(container.childElementCount).toBe(count)
}

export function testButtonIsDisabled (sut: RenderResult, fieldName: string, isDisabled: boolean): void {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

export function testStatusForField (sut: RenderResult, fieldName: string, errorMessage?: string): void {
  const emailStatus = sut.getByTestId(fieldName.concat('-status'))
  expect(emailStatus.title).toBe(errorMessage || 'Tudo certo')
  expect(emailStatus.textContent).toBe(errorMessage ? '🔴' : '🟢')
}

export function populateInput (sut: RenderResult, inputName: string, value: string): void {
  const input = sut.getByTestId(inputName)
  fireEvent.input(input, { target: { value: value } })
}

export function testElementExists (sut: RenderResult, fieldName: string): void {
  const element = sut.getByTestId(fieldName)
  expect(element).toBeTruthy()
}

export function testElementText (sut: RenderResult, fieldName: string, text: string): void {
  const element = sut.getByTestId(fieldName)
  expect(element.textContent).toBe(text)
}

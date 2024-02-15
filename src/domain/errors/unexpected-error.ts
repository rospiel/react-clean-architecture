export class UnexpectedError extends Error {
  constructor () {
    super('Instabilidade no sistema. Tente novamente em breve.')
    this.name = 'UnexpectedError'
  }
}

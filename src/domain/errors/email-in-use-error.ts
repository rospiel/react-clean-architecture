export class EmailInUseError extends Error {
  constructor () {
    super('Esse e-mail já tem uma conta atrelada')
    this.name = 'EmailInUseError'
  }
}
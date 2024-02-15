
import { AccessDeniedError } from '@/domain/errors'
import { useHistory } from 'react-router-dom'
import { useContext } from 'react'
import apiContext from '../contexts/api/api-context'
import useLogout from './use-logout'

type UseErrorHandlerProps = {
    callback: (error: Error) => void
}

type execute = (error: Error) => void


export default function useErrorHandler ({ callback }: UseErrorHandlerProps): execute {
  const history = useHistory()
  const logout = useLogout()
  const { setCurrentAccount } = useContext(apiContext)
  return function (error: Error): void {
    if (error instanceof AccessDeniedError) {
        logout()
        return 
    } 
      
    callback(error)
  }
}
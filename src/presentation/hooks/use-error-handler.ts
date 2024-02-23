import { AccessDeniedError } from '@/domain/errors'
import useLogout from './use-logout'
import { useRecoilValue } from 'recoil'
import { currentAccountState } from '../components/atoms/atoms'

type UseErrorHandlerProps = {
    callback: (error: Error) => void
}

type execute = (error: Error) => void


export default function useErrorHandler ({ callback }: UseErrorHandlerProps): execute {
  const logout = useLogout()
  const { setCurrentAccount } = useRecoilValue(currentAccountState)
  return function (error: Error): void {
    if (error instanceof AccessDeniedError) {
        logout()
        return 
    } 
      
    callback(error)
  }
}
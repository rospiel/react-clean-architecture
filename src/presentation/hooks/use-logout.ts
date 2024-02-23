
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { currentAccountState } from '../components/atoms/atoms'

type execute = () => void

export default function useLogout (): execute {
  const history = useNavigate()
  const { setCurrentAccount } = useRecoilValue(currentAccountState)
  return function (): void {
    setCurrentAccount(undefined)
    history('/login', { replace: true })
  }
}
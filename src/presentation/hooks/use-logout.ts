
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import apiContext from '../contexts/api/api-context'

type execute = () => void

export default function useLogout (): execute {
  const history = useNavigate()
  const { setCurrentAccount } = useContext(apiContext)
  return function (): void {
    setCurrentAccount(undefined)
    history('/login', { replace: true })
  }
}
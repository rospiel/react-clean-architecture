import React, { useContext } from 'react'
import { RouteProps, Route, Navigate, Outlet } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { currentAccountState } from '../atoms/atoms'

function isTokenEmpty (): boolean {
    const { getCurrentAccount } = useRecoilValue(currentAccountState)
    return !(getCurrentAccount()?.accessToken)
}

const PrivateRoute: React.FC<RouteProps> = (props: RouteProps) => {
    return isTokenEmpty() ? <Navigate to="/login" /> : <Outlet /> 
}

export default PrivateRoute
import apiContext from '@/presentation/contexts/api/api-context'
import React, { useContext } from 'react'
import { RouteProps, Route, Navigate, Outlet } from 'react-router-dom'

function isTokenEmpty (): boolean {
    const { getCurrentAccount } = useContext(apiContext)
    return !(getCurrentAccount()?.accessToken)
}

const PrivateRoute: React.FC<RouteProps> = (props: RouteProps) => {
    return isTokenEmpty() ? <Navigate to="/login" /> : <Outlet /> 
        
}

export default PrivateRoute
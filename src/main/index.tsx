import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from '@/main/routes/router'
import '@/presentation/styles/global.scss'
import setCurrentAccountAdapter, { getCurrentAccountAdapter } from '@/main/adapters/current-account-adapter'
import ApiContext from '@/presentation/contexts/api/api-context'


const root = ReactDOM.createRoot(document.getElementById("main") as HTMLElement);
root.render(
  
        <Router />
  
  
)

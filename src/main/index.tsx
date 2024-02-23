import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from '@/main/routes/router'
import '@/presentation/styles/global.scss'

const root = ReactDOM.createRoot(document.getElementById("main") as HTMLElement);
root.render(
  <Router />
)

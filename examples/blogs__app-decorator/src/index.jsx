import React from 'react'
import { render } from 'react-dom'
import { StoreProvider } from './store'
import 'todomvc-app-css/index.css'
import App from './components/App.jsx'

render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById('root')
)

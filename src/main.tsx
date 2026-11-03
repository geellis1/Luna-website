import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import OptionsProvider from './components/OptionsProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <OptionsProvider>
        <App />
      </OptionsProvider>
    </BrowserRouter>
  </StrictMode>,
)

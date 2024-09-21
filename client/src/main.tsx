import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto';
import App from './App.jsx'
import './index.css'

let root = document.getElementById('root') as HTMLElement;
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

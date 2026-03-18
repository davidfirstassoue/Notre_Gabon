import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

console.log("main.jsx: Initializing React app...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("main.jsx: Root element not found!");
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log("main.jsx: React render called.");
}

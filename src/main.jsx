import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 1. YEH IMPORT ZAROORI HAI
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. APP KO ISSE WRAP KARNA ZAROORI HAI */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
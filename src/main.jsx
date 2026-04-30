import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { initializeErrorHandlers } from './lib/errorHandler.js'
import './index.css'
import "./i18n";

// Initialize global error handlers
initializeErrorHandlers();

// Hand off from the static boot loader to the React Preloader.
const bootLoader = document.getElementById("boot-loader");
if (bootLoader) {
  bootLoader.style.opacity = "0";
  setTimeout(() => bootLoader.remove(), 300);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
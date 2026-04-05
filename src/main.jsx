import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext.jsx'

// This is the entry point of our React Application.
// React takes the 'root' div from index.html and injects our code into it.
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode helps find potential problems in the app during development by rendering components twice.
  <React.StrictMode>
    {/* BrowserRouter enables routing (navigation between pages) in our app without page reloads */}
    <BrowserRouter>
      {/* CartProvider makes the Cart Context available to all components inside the App */}
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

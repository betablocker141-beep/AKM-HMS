import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  import('workbox-window').then(({ Workbox }) => {
    const wb = new Workbox('/sw.js')
    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        if (confirm('New version available. Reload to update?')) {
          window.location.reload()
        }
      }
    })
    wb.register()
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

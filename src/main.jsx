import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initDB } from './utils/db'
import { startSyncOnNetwork } from './utils/sync'

// Initialize IndexedDB and start background sync
initDB().then(() => {
  startSyncOnNetwork();
}).catch((e) => console.warn('Failed to init DB', e));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

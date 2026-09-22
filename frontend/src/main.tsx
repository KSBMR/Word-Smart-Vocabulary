import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { LoadingScreen } from '@/components/LoadingScreen'
import { registerSW } from 'virtual:pwa-register'

// SW registration
if ('serviceWorker' in navigator) {
  try {
    registerSW({
      immediate: true,
      onOfflineReady() {
        console.log('✅ App ready to work offline')
      },
      onRegisteredSW(
        _swUrl: string,
        registration: ServiceWorkerRegistration | undefined
      ) {
        if (registration) {
          // Check for updates every 30 min
          setInterval(() => registration.update(), 30 * 60 * 1000)
        }
      },
      onRegisterError(error: any) {
        console.warn('⚠️ SW register error:', error)
      },
    })
  } catch (err) {
    console.warn('⚠️ SW not supported:', err)
  }
}

// Mount React
const rootEl = document.getElementById('root')
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <Suspense
        fallback={<LoadingScreen message="Starting Word Smart..." />}
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </Suspense>
    </React.StrictMode>
  )
}
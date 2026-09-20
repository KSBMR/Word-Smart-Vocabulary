

// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import './index.css'
// import { AuthProvider } from '@/contexts/AuthContext'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </React.StrictMode>
// )


import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { LoadingScreen } from '@/components/LoadingScreen'
import { registerSW } from 'virtual:pwa-register'

// Register service worker with auto-update
if ('serviceWorker' in navigator) {
  try {
    registerSW({
      immediate: true,
      onOfflineReady() {
        console.log('✅ App ready to work offline')
      },
      onNeedRefresh() {
        console.log('🔄 New content available, refresh to update')
      },
      onRegisteredSW(_swUrl: string, registration: ServiceWorkerRegistration | undefined) {
        if (registration) {
          setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000)
        }
      },
    })
  } catch (err) {
    console.warn('⚠️ Service worker registration skipped:', err)
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingScreen message="Starting Word Smart..." />}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Suspense>
  </React.StrictMode>
)
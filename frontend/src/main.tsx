

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

// ✅ Warm caches with data files immediately after load
function warmCaches() {
  if (!('caches' in window)) return

  const files = [
    '/wordsmart1.json',
    '/wordsmart2.json',
    '/analogy.json',
    '/favicon.svg',
    '/favicon.jpg',
  ]

  Promise.all(
    files.map((url) =>
      fetch(url, { cache: 'reload' }).catch(() => null)
    )
  ).then(() => {
    console.log('✅ Caches warmed with data files')
  })
}

// Register SW
if ('serviceWorker' in navigator) {
  try {
    registerSW({
      immediate: true,
      onOfflineReady() {
        console.log('✅ App ready to work offline')
        warmCaches()
      },
      onRegisteredSW(
        _swUrl: string,
        registration: ServiceWorkerRegistration | undefined
      ) {
        if (registration) {
          // Periodic update check
          setInterval(
            () => registration.update(),
            60 * 60 * 1000
          )
          // Warm caches after SW is registered
          setTimeout(warmCaches, 2000)
        }
      },
    })
  } catch (err) {
    console.warn('⚠️ SW registration failed:', err)
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
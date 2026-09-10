import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Réglages natifs (Android/iOS) — sans effet sur la version web
if (Capacitor.isNativePlatform()) {
  import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
    StatusBar.setBackgroundColor({ color: '#e8213a' }).catch(() => {})
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {})
  }).catch(() => {})
}

// Mise à jour du service worker : contrôle périodique, et surtout à chaque
// retour au premier plan. Sans ça, une version déployée pouvait mettre des
// heures à arriver sur les téléphones déjà ouverts.
const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (!registration) return
    const verifier = () => { registration.update().catch(() => {}) }
    setInterval(verifier, 15 * 60 * 1000)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') verifier()
    })
    window.addEventListener('online', verifier)
  },
  onNeedRefresh() {
    updateSW(true)
  },
})

// Quand un nouveau service worker prend le contrôle, on recharge une fois pour
// que la page affiche réellement la nouvelle version. Le garde-fou évite la
// boucle de rechargement.
let dejaRecharge = false
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (dejaRecharge) return
    dejaRecharge = true
    window.location.reload()
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

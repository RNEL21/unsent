import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

if (import.meta.env.DEV) {
  import('./devSeed').then((m) => m.seedIfRequested())
}

const root = ReactDOM.createRoot(document.getElementById('root'))
const storyboard =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has('storyboard')

if (storyboard) {
  import('./components/SendStoryboard').then((m) =>
    root.render(
      <React.StrictMode>
        <m.default />
      </React.StrictMode>
    )
  )
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

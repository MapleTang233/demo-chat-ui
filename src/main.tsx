import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

const copilotBotContainerID = 'tigergraph-copilot-bot-root'

let root = document.getElementById(copilotBotContainerID)

const token = function() {
  const currScript = document.currentScript
  if (currScript instanceof HTMLScriptElement) {
    console.log('src: ', currScript.src)
    const queryString = currScript.src.split('?')[1]
    const p = new URLSearchParams(queryString)
    return p.get('token')
  }
}()

if (token) {
  import('./index.css')
}
window.addEventListener('load', async () => {
  if (!token) {
    alert('Token is required to run the bot')
    return
  }
  if (!root) {
    console.log('root')
    root = document.createElement('div')
    root.setAttribute('id', copilotBotContainerID)
    document.body.append(root)
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )

  setTimeout(async () => {
    const a = await import('./test.ts')
    console.log(a.default)
  }, 1000)
})

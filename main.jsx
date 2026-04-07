import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import KurdiWallet from '/KurdiWallet.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <KurdiWallet />
  </StrictMode>,
)

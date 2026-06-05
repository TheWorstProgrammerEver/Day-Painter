import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppDispatcherProvider } from './components/AppDispatcherProvider/AppDispatcherProvider'
import { EditorScreen } from './screens/EditorScreen/EditorScreen'
import { registerServiceWorker } from './registerServiceWorker'
import { ViewTemplateScreen } from './screens/ViewTemplateScreen/ViewTemplateScreen'
import './styles/global.scss'

registerServiceWorker()

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AppDispatcherProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EditorScreen />} />
          <Route path="/view/:templateName" element={<ViewTemplateScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppDispatcherProvider>
  </StrictMode>
)

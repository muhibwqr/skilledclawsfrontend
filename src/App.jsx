import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { LandingPage } from './pages/LandingPage'
import { DiagramPage } from './pages/DiagramPage'
import { GeneratePage } from './pages/GeneratePage'
import { HomePage } from './pages/HomePage'
import { PastSkillsPage } from './pages/PastSkillsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/diagram" element={<DiagramPage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/past-skills" element={<PastSkillsPage />} />
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

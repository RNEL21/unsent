import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import NavBar from './components/NavBar'
import Desk from './pages/Desk'
import Drawer from './pages/Drawer'
import Sunday from './pages/Sunday'
import Stats from './pages/Stats'
import { lampVars } from './utils/date'

/**
 * Одна комната вместо четырёх страниц: сцена (комната, лампа, тень)
 * постоянна, содержимое движется через глубину — уходит назад и вверх,
 * новое поднимается из темноты.
 */
function Scene() {
  const location = useLocation()
  const lamp = lampVars()

  return (
    <div
      className="room"
      style={{
        '--lamp-spread': lamp.spread,
        '--lamp-glow': lamp.glow,
      }}
    >
      <div className="room__light" />
      <div className="room__shade" />
      <NavBar />
      <div className="scene">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 26, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -18, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<Desk />} />
              <Route path="/drawer" element={<Drawer />} />
              <Route path="/sunday" element={<Sunday />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="*" element={<Desk />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Scene />
    </BrowserRouter>
  )
}

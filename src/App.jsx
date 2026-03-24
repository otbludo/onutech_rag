import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';

/**
 * UI component responsible for rendering app.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="home" element={<HomeScreen />} />
    </Routes>
  )
}

export default App;

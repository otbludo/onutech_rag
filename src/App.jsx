import { useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import { InstallBanner } from "./components/PWA/InstallBanner";

/**
 * UI component responsible for rendering app.
 */
function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err =>
        console.log('Service Worker registration failed:', err)
      );
    }
  }, []);

  return (
    <>
      <InstallBanner />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomeScreen />} />
      </Routes>
    </>
  )
}

export default App;

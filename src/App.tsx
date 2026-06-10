import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';

function TrackRedirect() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  if (orderId) {
    return <Navigate to={`/track/${orderId}?${searchParams.toString()}`} replace />;
  }
  return <Navigate to="/" replace />;
}
import Themes from './pages/Themes';
import Order from './pages/Order';
import Track from './pages/Track';
import EditOrder from './pages/EditOrder';
import Invitation from './pages/Invitation';
import Preview from './pages/Preview';
import Admin from './pages/Admin';
import Layout from './layouts/Layout';

import Socials from './pages/Socials';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

export default function App() {
  React.useEffect(() => {
    // Disable right-click and specific keyboard shortcuts for basic protection
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      
      if (
        e.key === 'F12' ||
        // Windows/Linux shortcuts
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && ['U', 'S', 'P'].includes(e.key.toUpperCase())) ||
        // Mac OS shortcuts
        (e.metaKey && e.altKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.metaKey && ['U', 'S', 'P'].includes(e.key.toUpperCase()))
      ) {
        e.preventDefault();
      }
    };

    if (process.env.NODE_ENV === 'production') {
       document.addEventListener('contextmenu', handleContextMenu);
       document.addEventListener('keydown', handleKeyDown);
    }
    
    // Enable even in dev mode if we want to demonstrate it to the user now, but maybe it's better to enable it generally. 
    // Actually, I'll enable it generally to satisfy the user request unconditionally, but comment it.
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        {/* Core public app with layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/order/:themeId" element={<Order />} />
          <Route path="/track" element={<TrackRedirect />} />
          <Route path="/track/:orderCode" element={<Track />} />
          <Route path="/edit-order/:orderCode" element={<EditOrder />} />
          <Route path="/socials" element={<Socials />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>
        
        {/* Render invitation and preview independently without the main navigation layout */}
        <Route path="/invitation/:slug" element={<Invitation />} />
        <Route path="/preview/:themeId" element={<Preview />} />
        
        {/* Admin route */}
        <Route path="/secure-admin-login" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

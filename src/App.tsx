import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Themes from './pages/Themes';
import Order from './pages/Order';
import Track from './pages/Track';
import EditOrder from './pages/EditOrder';
import Invitation from './pages/Invitation';
import Preview from './pages/Preview';
import Admin from './pages/Admin';
import Layout from './layouts/Layout';

import Socials from './pages/Socials';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        {/* Core public app with layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/order/:themeId" element={<Order />} />
          <Route path="/track/:orderCode" element={<Track />} />
          <Route path="/edit-order/:orderCode" element={<EditOrder />} />
          <Route path="/socials" element={<Socials />} />
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

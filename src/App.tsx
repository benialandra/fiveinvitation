import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Layout from './layouts/Layout';
import { Loader2 } from 'lucide-react';
import { LazyMotion, domAnimation } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';

// Lazy-loaded components to reduce initial bundle size
const FakeSalesNotification = React.lazy(() => import('./components/FakeSalesNotification'));

// Lazy-loaded pages for code splitting — reduces initial bundle by ~300KB+
const Themes = React.lazy(() => import('./pages/Themes'));
const Order = React.lazy(() => import('./pages/Order'));
const Track = React.lazy(() => import('./pages/Track'));
const EditOrder = React.lazy(() => import('./pages/EditOrder'));
const Invitation = React.lazy(() => import('./pages/Invitation'));
const Preview = React.lazy(() => import('./pages/Preview'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Socials = React.lazy(() => import('./pages/Socials'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Suspense fallback component
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
    </div>
  );
}

function TrackRedirect() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  if (orderId) {
    return <Navigate to={`/track/${orderId}?${searchParams.toString()}`} replace />;
  }
  return <Navigate to="/" replace />;
}

export default function App() {
  React.useEffect(() => {
    // Anti-right-click block removed for better UX.
  }, []);

  return (
    <ErrorBoundary>
      <LazyMotion features={domAnimation}>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={null}>
            <FakeSalesNotification />
          </Suspense>
          <Toaster position="top-center" />
          <Suspense fallback={<PageLoader />}>
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
                
                {/* 404 catch-all within layout */}
                <Route path="*" element={<NotFound />} />
              </Route>
              
              {/* Render invitation and preview independently without the main navigation layout */}
              <Route path="/invitation/:slug" element={<Invitation />} />
              <Route path="/preview/:themeId" element={<Preview />} />
              
              {/* Admin route */}
              <Route path="/secure-admin-login" element={<Admin />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LazyMotion>
    </ErrorBoundary>
  );
}

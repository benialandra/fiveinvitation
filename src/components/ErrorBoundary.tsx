import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] text-white p-8">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-6 border-2 border-[#C5A059] rotate-45 flex items-center justify-center">
              <span className="-rotate-45 text-3xl font-serif text-[#C5A059]">!</span>
            </div>
            <h1 className="font-serif text-3xl mb-4">Oops, Terjadi Kesalahan</h1>
            <p className="text-white/60 mb-8 text-sm leading-relaxed">
              Halaman mengalami masalah. Silakan muat ulang halaman atau kembali ke beranda.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 gold-gradient text-black rounded-xl font-semibold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Muat Ulang
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 border border-white/20 rounded-xl text-sm uppercase tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
              >
                Ke Beranda
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React, { useState, useEffect, Component } from 'react';
import confetti from 'canvas-confetti';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ResumeInput from './components/ResumeInput';
import RoastResults from './components/RoastResults';
import HistoryModal from './components/HistoryModal';
import FlameEffect from './components/FlameEffect';
import About from './pages/About';
import Feedback from './pages/Feedback';
import { api } from './services/api';
import { AlertCircle, Flame, RefreshCw } from 'lucide-react';

// Error Boundary to prevent blank screen crash
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0914] text-slate-900 dark:text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#131124] border border-red-300 dark:border-red-500/30 max-w-md w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Something went wrong</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [roastData, setRoastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Theme state: default 'dark'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check URL query parameters for shared roastId
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roastId = params.get('roastId');
    if (roastId) {
      loadSharedRoast(roastId);
    }
  }, []);

  const loadSharedRoast = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getRoastById(id);
      if (data) {
        setRoastData(data);
      }
    } catch (err) {
      setError(`Failed to load shared roast: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoastSubmit = async (payload) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await api.submitRoast(payload);
      setRoastData(result);

      // Trigger confetti burst
      try {
        const score = result?.overall_score ?? result?.overallScore ?? 50;
        if (score >= 65) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } else {
          confetti({
            particleCount: 50,
            spread: 60,
            colors: ['#f97316', '#ef4444', '#eab308'],
            origin: { y: 0.7 }
          });
        }
      } catch (confettiErr) {
        console.warn('Confetti effect skipped:', confettiErr);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission Error:', err);
      setError(err.message || 'Something went wrong while roasting the resume.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRoastData(null);
    setError(null);
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BrowserRouter>
    <ErrorBoundary>
      <div className="relative min-h-screen bg-slate-50 dark:bg-[#0B0914] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white transition-colors duration-200">
        {/* Background ambient flame effect */}
        <FlameEffect active={true} theme={theme} />

        {/* Header Navigation with Theme Toggle */}
        <Navbar
          onOpenHistory={() => setIsHistoryOpen(true)}
          onReset={handleReset}
          hasResults={!!roastData}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Main Content Area */}
        <main className="flex-1 relative z-10">

  {/* Error Notification Banner */}
  {error && (
    <div className="max-w-2xl mx-auto px-4 pt-6">
      <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 flex items-center justify-between gap-3 shadow-sm">

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>

        <button
          onClick={() => setError(null)}
          className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold shrink-0"
        >
          Dismiss
        </button>

      </div>
    </div>
  )}

  <Routes>

    {/* HOME PAGE */}
    <Route
      path="/"
      element={
        !roastData ? (
          <>
            <Hero />

            <ResumeInput
              onSubmit={handleRoastSubmit}
              isLoading={isLoading}
            />
          </>
        ) : (
          <div className="pt-8">
            <RoastResults
              data={roastData}
              onReset={handleReset}
            />
          </div>
        )
      }
    />

    {/* ABOUT / INFO PAGE */}
    <Route
      path="/about"
      element={<About />}
    />

    {/* FEEDBACK PAGE */}
    <Route
      path="/feedback"
      element={<Feedback />}
    />

  </Routes>

</main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0B0914]/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-slate-800 dark:text-slate-300">AI Resume Brutal Roaster</span>
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px]">
              Built with React, Tailwind CSS, Node.js & Express.
            </div>
          </div>
        </footer>

        {/* History Modal */}
        <HistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onSelectRoast={(selected) => {
            setRoastData(selected);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    </ErrorBoundary>
    </BrowserRouter>
  );
}

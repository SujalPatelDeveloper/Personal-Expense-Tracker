import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import ScrollToTop from './components/ScrollToTop';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  // Redirect to home if not authenticated and trying to access protected pages
  const protectedPages = ['dashboard', 'analytics', 'recurring'];
  const page = protectedPages.includes(currentPage) && !isAuthenticated ? 'home' : currentPage;

  const renderPage = () => {
    switch (page) {
      case 'auth':
        if (isAuthenticated) return <Dashboard />;
        return <AuthPage setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'home':
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <>
      <Navbar currentPage={page} setCurrentPage={setCurrentPage} />
      <main>{renderPage()}</main>
      <ScrollToTop />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, Wallet, LogOut, LayoutDashboard, BarChart2, Repeat, Trash2 } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ currentPage, setCurrentPage }) {
   const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, deleteAccount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
    setMobileMenuOpen(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('WARNING: Are you sure you want to delete your account? All your transaction data and settings will be permanently removed. This cannot be undone.')) {
      deleteAccount();
      setCurrentPage('home');
      setMobileMenuOpen(false);
    }
  };

  const navigate = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        <button className="navbar-brand" onClick={() => navigate('home')} id="nav-brand">
          <div className="brand-icon">
            <Wallet size={22} />
          </div>
          <span className="brand-text">TrackIt</span>
        </button>

        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <button
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => navigate('home')}
            id="nav-home"
          >
            Home
          </button>

          {isAuthenticated ? (
            <>
              <button
                className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={() => navigate('dashboard')}
                id="nav-dashboard"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              <button
                className={`nav-link ${currentPage === 'analytics' ? 'active' : ''}`}
                onClick={() => navigate('analytics')}
                id="nav-analytics"
              >
                <BarChart2 size={16} />
                Analytics
              </button>
              <div className="nav-user-section">
                <div className="nav-user-avatar">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="nav-user-name">{user?.name}</span>
                <button className="btn btn-sm btn-secondary nav-logout" onClick={handleLogout} id="nav-logout">
                  <LogOut size={14} />
                  Logout
                </button>
                <button className="btn btn-sm btn-danger-soft nav-delete-account" onClick={handleDeleteAccount} id="nav-delete-account" title="Delete Account">
                  <Trash2 size={14} />
                </button>
              </div>
            </>
          ) : null}
        </div>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            id="theme-toggle"
            aria-label="Toggle theme"
          >
            <div className="toggle-track">
              <div className={`toggle-thumb ${theme === 'dark' ? 'dark' : ''}`}>
                {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              </div>
            </div>
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          
          {!isAuthenticated && (
            <button
              className={`btn-signin-nav ${currentPage === 'auth' ? 'active' : ''}`}
              onClick={() => navigate('auth')}
              id="nav-auth-premium"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {mobileMenuOpen && <div className="mobile-backdrop" onClick={() => setMobileMenuOpen(false)} />}
    </nav>
  );
}

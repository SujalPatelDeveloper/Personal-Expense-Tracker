import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, Wallet, LogOut, LayoutDashboard, BarChart2, Trash2 } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, deleteAccount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: Are you sure you want to delete your account? All your transaction data and settings will be permanently removed. This cannot be undone.')) {
      await deleteAccount();
      navigate('/');
      setMobileMenuOpen(false);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        <button className="navbar-brand" onClick={() => handleNavigate('/')} id="nav-brand">
          <div className="brand-icon">
            <Wallet size={22} />
          </div>
          <span className="brand-text">TrackIt</span>
        </button>

        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <button
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => handleNavigate('/')}
            id="nav-home"
          >
            Home
          </button>
          <button
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => handleNavigate('/about')}
            id="nav-about"
          >
            About
          </button>
          <button
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={() => handleNavigate('/contact')}
            id="nav-contact"
          >
            Contact
          </button>

          {isAuthenticated ? (
            <>
              <button
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => handleNavigate('/dashboard')}
                id="nav-dashboard"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              <button
                className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
                onClick={() => handleNavigate('/analytics')}
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
              className={`btn-signin-nav ${isActive('/auth') ? 'active' : ''}`}
              onClick={() => handleNavigate('/auth')}
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

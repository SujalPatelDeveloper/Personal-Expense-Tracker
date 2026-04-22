import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, Wallet, LayoutDashboard, BarChart2, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowUserMenu(false);
    setMobileMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  const isActive = (path) => location.pathname === path;
  const isAppSection = location.pathname === '/dashboard' || location.pathname === '/analytics';

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
          {(!isAppSection || isAuthenticated) && (
            <>
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
            </>
          )}

          {isAuthenticated && (
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
            </>
          )}
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
          
          {!isAuthenticated ? (
            <button
              className={`btn-signin-nav ${isActive('/auth') ? 'active' : ''}`}
              onClick={() => handleNavigate('/auth')}
              id="nav-auth-premium"
            >
              Sign In
            </button>
          ) : (
            <div className="nav-user-section" ref={userMenuRef}>
              <button 
                className={`nav-profile-toggle ${showUserMenu ? 'active' : ''}`}
                onClick={() => setShowUserMenu(!showUserMenu)}
                title="User Menu"
              >
                <div className="nav-user-avatar">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="nav-user-name">{user?.name}</span>
                <ChevronDown size={14} className={`menu-chevron ${showUserMenu ? 'rotate' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="user-dropdown-menu glass-card animate-fadeInScale">
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{user?.name}</p>
                    <p className="dropdown-user-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => handleNavigate('/profile')}>
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <button className="dropdown-item" onClick={() => handleNavigate('/dashboard')}>
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {mobileMenuOpen && <div className="mobile-backdrop" onClick={() => setMobileMenuOpen(false)} />}
    </nav>
  );
}

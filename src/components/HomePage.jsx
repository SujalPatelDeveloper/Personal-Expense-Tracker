import { TrendingUp, Shield, PieChart, ArrowRight, Wallet, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <TrendingUp size={28} />,
      title: 'Track Spending',
      desc: 'Monitor every rupee with detailed expense logging and smart categorization.',
      color: 'var(--accent-primary)'
    },
    {
      icon: <PieChart size={28} />,
      title: 'Visual Insights',
      desc: 'Beautiful charts and breakdowns to understand your spending patterns.',
      color: 'var(--info)'
    },
    {
      icon: <Shield size={28} />,
      title: 'Secure & Private',
      desc: 'Your financial data stays on your device. No servers, no tracking.',
      color: 'var(--success)'
    },
    {
      icon: <Zap size={28} />,
      title: 'Lightning Fast',
      desc: 'Instant performance with zero loading. Add expenses in seconds.',
      color: 'var(--warning)'
    }
  ];

  return (
    <div className="home-page" id="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-effects">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge animate-fadeInUp">
            <Sparkles size={14} />
            <span>Smart Financial Tracking</span>
          </div>
          <h1 className="hero-title animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Take Control of Your
            <span className="accent-text"> Finances</span>
          </h1>
          <p className="hero-subtitle animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Track, analyze, and optimize your spending with a beautiful, 
            privacy-first expense tracker that works entirely on your device.
          </p>
          <div className="hero-actions animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            {isAuthenticated ? (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/dashboard')}
                id="hero-dashboard-btn"
              >
                Go to Dashboard
                <ArrowRight size={18} />
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/auth')}
                  id="hero-get-started-btn"
                >
                  Get Started Free
                  <ArrowRight size={18} />
                </button>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => navigate('/auth')}
                  id="hero-signin-btn"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="hero-stats animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Private</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">0₹</span>
              <span className="stat-label">Forever Free</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">Expenses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features-section">
        <div className="container">
          <div className="section-header animate-fadeInUp">
            <span className="section-tag">Features</span>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">
              Simple yet powerful tools to manage your personal finances effectively.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card glass-card animate-fadeInUp"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="feature-icon" style={{ background: `${feature.color}15`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta-section">
        <div className="container">
          <div className="cta-card glass-card animate-fadeInUp">
            <div className="cta-bg-orb"></div>
            <div className="cta-content">
              <Wallet size={40} className="cta-icon" />
              <h2 className="cta-title">Ready to Start Tracking?</h2>
              <p className="cta-text">
                Join and take the first step towards better financial health. It's free forever.
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
                id="cta-action-btn"
              >
                {isAuthenticated ? 'Open Dashboard' : 'Create Free Account'}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

import React from 'react';
import { Target, Shield, Zap, Heart, Globe, TrendingUp, Users, Star, CheckCircle, BarChart2, Lock, Smartphone } from 'lucide-react';
import './AboutPage.css';

const VALUES = [
  { icon: Shield, title: 'Security First', desc: 'Bank-grade encryption keeps your financial data private and safe — always.', color: '#10b981' },
  { icon: Zap, title: 'Pure Simplicity', desc: 'No complex jargon. Just a clean, intuitive interface that makes tracking a breeze.', color: '#0ea5e9' },
  { icon: Heart, title: 'User Centric', desc: 'Every feature we build is inspired by our community\'s real needs and feedback.', color: '#ef4444' },
  { icon: Globe, title: 'Accessibility', desc: 'Available whenever you need it, across all your modern devices — offline too.', color: '#8b5cf6' },
];

const FEATURES = [
  { icon: BarChart2, text: 'Visual analytics & smart insights' },
  { icon: Lock, text: 'End-to-end data encryption' },
  { icon: Smartphone, text: 'Works on any device, any time' },
  { icon: TrendingUp, text: 'Track spending patterns over time' },
  { icon: CheckCircle, text: 'Export reports as PDF & Excel' },
  { icon: Users, text: 'Built for students & professionals' },
];

export default function AboutPage() {
  return (
    <div className="about-page" id="about-page">

      {/* ── HERO ── */}
      <div className="about-hero">
        <div className="about-hero-bg-orb orb-1" />
        <div className="about-hero-bg-orb orb-2" />
        <div className="container">
          <span className="about-badge animate-fadeInUp">Our Story</span>
          <h1 className="about-hero-title animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
            Empowering Your<br />
            <span className="accent-text">Financial Freedom</span>
          </h1>
          <p className="about-hero-sub animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            TrackIt is more than just an expense tracker. It's your personal financial
            companion designed to help you take control of your future, one transaction at a time.
          </p>
        </div>
      </div>

      <div className="container">

        {/* ── MISSION + FEATURES ── */}
        <div className="about-mission-row animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
          {/* Mission Card */}
          <div className="mission-card glass-card">
            <div className="mission-icon-wrap">
              <Target size={28} />
            </div>
            <h2>Our Mission</h2>
            <p>
              To provide individuals with a seamless, secure, and beautiful platform to monitor
              their spending, identify saving opportunities, and build lasting wealth. We believe
              financial clarity is the foundation of a stress-free life.
            </p>
            <div className="mission-divider" />
            <div className="mission-features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="mission-feature-item">
                  <f.icon size={16} className="mf-icon" />
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Column */}
          <div className="about-stats-col">
            {[
              { number: '50K+', label: 'Active Users', sub: 'and growing every day', icon: Users },
              { number: '₹1B+', label: 'Tracked', sub: 'in total expenses', icon: TrendingUp },
              { number: '4.9', label: 'User Rating', sub: 'out of 5 stars', icon: Star },
            ].map((s, i) => (
              <div key={i} className="about-stat-card glass-card animate-fadeInUp" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                <div className="about-stat-icon-wrap">
                  <s.icon size={20} />
                </div>
                <div>
                  <div className="about-stat-number">{s.number}</div>
                  <div className="about-stat-label">{s.label}</div>
                  <div className="about-stat-sub">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CORE VALUES ── */}
        <section className="about-values">
          <div className="section-eyebrow animate-fadeInUp">What We Stand For</div>
          <h2 className="about-section-title animate-fadeInUp" style={{ animationDelay: '0.05s' }}>Our Core Values</h2>
          <p className="about-section-sub animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            The principles that guide every decision we make at TrackIt.
          </p>
          <div className="values-grid">
            {VALUES.map((value, i) => (
              <div
                key={i}
                className="value-card glass-card animate-fadeInUp"
                style={{ animationDelay: `${0.15 + i * 0.08}s` }}
              >
                <div className="value-icon-wrapper" style={{ background: `${value.color}15`, color: value.color }}>
                  <value.icon size={22} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="about-cta animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="about-cta-card glass-card">
            <div className="about-cta-orb" />
            <div className="about-cta-content">
              <span className="about-badge">Get Started</span>
              <h2>Ready to transform your finances?</h2>
              <p>Join thousands of others who have already taken the first step towards financial clarity.</p>
              <button className="btn btn-primary btn-lg" onClick={() => window.location.href = '/auth'}>
                Start for Free <TrendingUp size={18} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

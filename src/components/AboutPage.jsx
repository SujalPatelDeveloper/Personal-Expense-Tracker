import React from 'react';
import { Target, Shield, Zap, Heart, Users, Globe, Award, TrendingUp } from 'lucide-react';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page" id="about-page">
      <div className="about-hero">
        <div className="container">
          <h1 className="about-hero-title animate-fadeInUp">
            Empowering Your <span className="accent-text">Financial Freedom</span>
          </h1>
          <p className="about-hero-sub animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            TrackIt is more than just an expense tracker. It's your personal financial companion designed to help you take control of your future, one transaction at a time.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="about-mission animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="mission-card glass-card">
            <div className="mission-icon">
              <Target size={32} />
            </div>
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p>
                To provide individuals with a seamless, secure, and beautiful platform to monitor their spending, 
                identify saving opportunities, and build lasting wealth. We believe that financial clarity 
                is the foundation of a stress-free life.
              </p>
            </div>
          </div>
        </div>

        <section className="about-values">
          <h2 className="section-title text-center animate-fadeInUp">Our Core Values</h2>
          <div className="values-grid">
            {[
              { icon: Shield, title: 'Security First', desc: 'Your data is yours. We use bank-grade encryption to ensure your privacy is never compromised.' },
              { icon: Zap, title: 'Pure Simplicity', desc: 'No complex jargon. Just a clean, intuitive interface that makes tracking expenses a breeze.' },
              { icon: Heart, title: 'User Centric', desc: 'Every feature we build is inspired by our community’s needs and feedback.' },
              { icon: Globe, title: 'Accessibility', desc: 'Available whenever and wherever you need it, across all your modern devices.' }
            ].map((value, i) => (
              <div key={i} className="value-card glass-card animate-fadeInUp" style={{ animationDelay: `${0.3 + (i * 0.1)}s` }}>
                <div className="value-icon-wrapper">
                  <value.icon size={24} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-stats animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
          <div className="stats-container glass-card">
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">₹1B+</span>
              <span className="stat-label">Expenses Tracked</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9/5</span>
              <span className="stat-label">User Rating</span>
            </div>
          </div>
        </section>

        <section className="about-cta animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
          <div className="cta-card glass-card accent-gradient-bg">
            <h2>Ready to transform your finances?</h2>
            <p>Join thousands of others who have already taken the first step towards financial clarity.</p>
            <button className="btn btn-white btn-lg" onClick={() => window.location.href = '/'}>
              Get Started Now <TrendingUp size={18} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

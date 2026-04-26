import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import LegalModal from './LegalModal';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [legalModal, setLegalModal] = useState({ isOpen: false, type: 'privacy' });

  const openLegal = (type) => {
    setLegalModal({ isOpen: true, type });
  };

  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="accent-text">Track</span>It
            </div>
            <p className="footer-tagline">
              Your personal financial companion for tracking expenses and building lasting wealth.
            </p>
          </div>

          <div className="footer-links-group">
            <h3>Platform</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/analytics">Analytics</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><button onClick={() => openLegal('terms')}>Terms of Service</button></li>
              <li><button onClick={() => openLegal('privacy')}>Privacy Policy</button></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h3>Stay Updated</h3>
            <p>Subscribe to get financial tips and news.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Email address" className="input-field" />
              <button className="btn btn-primary btn-icon-only" aria-label="Subscribe">
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © {currentYear} TrackIt Inc. All rights reserved. Made with ❤️ for your finances.
          </div>
          <div className="footer-legal-links">
            <button onClick={() => openLegal('privacy')}>Privacy</button>
            <button onClick={() => openLegal('terms')}>Terms</button>
            <Link to="/contact">Support</Link>
          </div>
        </div>
      </div>

      <LegalModal 
        type={legalModal.type} 
        isOpen={legalModal.isOpen} 
        onClose={() => setLegalModal({ ...legalModal, isOpen: false })} 
      />
    </footer>
  );
}

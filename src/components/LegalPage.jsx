import React from 'react';
import { ShieldCheck, FileText, Lock, Scale } from 'lucide-react';
import './LegalPage.css';

export default function LegalPage({ type }) {
  const isPrivacy = type === 'privacy';
  
  return (
    <div className="legal-page" id="legal-page">
      <div className="legal-header">
        <div className="container">
          <div className="legal-icon animate-fadeInUp">
            {isPrivacy ? <ShieldCheck size={48} /> : <FileText size={48} />}
          </div>
          <h1 className="legal-title animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
          </h1>
          <p className="legal-date animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Last updated: April 22, 2026
          </p>
        </div>
      </div>

      <div className="container">
        <div className="legal-content-card glass-card animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          {isPrivacy ? (
            <div className="legal-body">
              <section>
                <h2>1. Introduction</h2>
                <p>Welcome to TrackIt. We respect your privacy and want to protect your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
              </section>
              <section>
                <h2>2. The Data We Collect</h2>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                <ul>
                  <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                  <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                  <li><strong>Financial Data</strong> includes your tracked expenses and income records. Note: We do not store bank login credentials.</li>
                </ul>
              </section>
              <section>
                <h2>3. How We Use Your Data</h2>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to provide the services you requested, to manage your account, and to improve our platform.</p>
              </section>
              <section>
                <h2>4. Data Security</h2>
                <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
              </section>
            </div>
          ) : (
            <div className="legal-body">
              <section>
                <h2>1. Terms</h2>
                <p>By accessing the website at TrackIt, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
              </section>
              <section>
                <h2>2. Use License</h2>
                <p>Permission is granted to temporarily download one copy of the materials (information or software) on TrackIt's website for personal, non-commercial transitory viewing only.</p>
              </section>
              <section>
                <h2>3. Disclaimer</h2>
                <p>The materials on TrackIt's website are provided on an 'as is' basis. TrackIt makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              </section>
              <section>
                <h2>4. Accuracy of Materials</h2>
                <p>The materials appearing on TrackIt's website could include technical, typographical, or photographic errors. TrackIt does not warrant that any of the materials on its website are accurate, complete or current.</p>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

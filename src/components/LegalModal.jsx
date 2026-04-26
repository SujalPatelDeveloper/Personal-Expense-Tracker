import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText, Lock, Scale } from 'lucide-react';
import './LegalModal.css';

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    icon: <ShieldCheck size={24} />,
    sections: [
      {
        title: '1. Introduction',
        content: 'Welcome to TrackIt. We respect your privacy and want to protect your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.'
      },
      {
        title: '2. The Data We Collect',
        content: 'We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:',
        list: [
          'Identity Data includes first name, last name, username or similar identifier.',
          'Contact Data includes email address and telephone numbers.',
          'Financial Data includes your tracked expenses and income records. Note: We do not store bank login credentials.'
        ]
      },
      {
        title: '3. How We Use Your Data',
        content: 'We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to provide the services you requested, to manage your account, and to improve our platform.'
      },
      {
        title: '4. Data Security',
        content: 'We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.'
      }
    ]
  },
  terms: {
    title: 'Terms of Service',
    icon: <FileText size={24} />,
    sections: [
      {
        title: '1. Terms',
        content: 'By accessing the website at TrackIt, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.'
      },
      {
        title: '2. Use License',
        content: 'Permission is granted to temporarily download one copy of the materials (information or software) on TrackIt\'s website for personal, non-commercial transitory viewing only.'
      },
      {
        title: '3. Disclaimer',
        content: 'The materials on TrackIt\'s website are provided on an \'as is\' basis. TrackIt makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.'
      },
      {
        title: '4. Accuracy of Materials',
        content: 'The materials appearing on TrackIt\'s website could include technical, typographical, or photographic errors. TrackIt does not warrant that any of the materials on its website are accurate, complete or current.'
      }
    ]
  }
};

export default function LegalModal({ type, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const data = CONTENT[type] || CONTENT.privacy;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon">
              {data.icon}
            </div>
            <h2>{data.title}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>
        </header>

        <div className="modal-body">
          {data.sections.map((section, idx) => (
            <section key={idx}>
              <h3>{section.title}</h3>
              <p>{section.content}</p>
              {section.list && (
                <ul>
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <footer className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            I Understand
          </button>
        </footer>
      </div>
    </div>
  );
}

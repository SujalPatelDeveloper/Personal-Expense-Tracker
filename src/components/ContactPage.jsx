import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import './ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError('');

    try {
      // NOTE: Replace these strings with your actual EmailJS credentials
      // You can get them from https://dashboard.emailjs.com/
      const SERVICE_ID = 'service_mailto_sujal';
      const TEMPLATE_ID = 'template_am5r0jx'; // Find this in "Email Templates"
      const PUBLIC_KEY = 'LgVutxYPfspSpeY7_';  // Find this in "Account" -> "API Keys"

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: formData.name,       // Matches {{name}}
          from_name: formData.name,  // Matches {{from_name}}
          from_email: formData.email, // Matches {{from_email}}
          subject: formData.subject,  // Matches {{subject}}
          message: formData.message,  // Matches {{message}}
        },
        PUBLIC_KEY
      );

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('EmailJS Error:', err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="contact-page" id="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1 className="contact-hero-title animate-fadeInUp">
            Get in <span className="accent-text">Touch</span>
          </h1>
          <p className="contact-hero-sub animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Have questions, feedback, or need support? We're here to help you navigate your financial journey.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info-section animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="info-card-group">
              <div className="info-card glass-card">
                <div className="info-icon">
                  <Mail size={24} />
                </div>
                <div className="info-text">
                  <h3>Email Us</h3>
                  <p>support@trackit.com</p>
                  <p>hello@trackit.com</p>
                </div>
              </div>

              <div className="info-card glass-card">
                <div className="info-icon">
                  <Phone size={24} />
                </div>
                <div className="info-text">
                  <h3>Call Us</h3>
                  <p>+91 98765 43210</p>
                  <p>Mon - Fri, 9am - 6pm</p>
                </div>
              </div>

              <div className="info-card glass-card">
                <div className="info-icon">
                  <MapPin size={24} />
                </div>
                <div className="info-text">
                  <h3>Visit Us</h3>
                  <p>123 Finance Square, Tech Hub</p>
                  <p>Bangalore, KA 560001</p>
                </div>
              </div>
            </div>

            <div className="social-connect glass-card">
              <h3>Connect with us</h3>
              <div className="social-links">
                <button className="social-link-btn" aria-label="Twitter"><Globe size={20} /></button>
                <button className="social-link-btn" aria-label="LinkedIn"><MessageSquare size={20} /></button>
                <button className="social-link-btn" aria-label="Instagram"><Clock size={20} /></button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="contact-form-card glass-card">
              <div className="form-card-header">
                <h2>Send a Message</h2>
                <p>We'll get back to you within 24 hours.</p>
              </div>
              {submitted ? (
                <div className="form-success">
                  <div className="success-icon">
                    <Send size={48} />
                  </div>
                  <h2>Message Sent!</h2>
                  <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        className="input-field"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        className="input-field"
                        placeholder="john@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      className="input-field"
                      placeholder="How can we help?"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      className="input-field"
                      rows="6"
                      placeholder="Your message here..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>
                  {error && (
                    <div className="error-message animate-fadeInUp">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-full"
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>Sending... <Loader2 size={18} className="animate-spin" /></>
                    ) : (
                      <>Send Message <Send size={18} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

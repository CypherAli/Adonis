"use client"

import Link from 'next/link'
import './contact.css'

export default function ContactPage() {
  return (
    <div className="contact-page">
      <div className="container">
        <h1>📞 Contact Us</h1>
        <p className="contact-description">
          We'd love to hear from you! Get in touch with us.
        </p>
        
        <div className="contact-content">
          <div className="contact-info">
            <h2>Contact Information</h2>
            <div className="info-item">
              <strong>📍 Address:</strong>
              <p>Hanoi, Vietnam</p>
            </div>
            <div className="info-item">
              <strong>📞 Hotline:</strong>
              <p><a href="tel:0846865650">084.686.5650</a></p>
            </div>
            <div className="info-item">
              <strong>✉️ Email:</strong>
              <p><a href="mailto:trinhviethoangawm@gmail.com">trinhviethoangawm@gmail.com</a></p>
            </div>
            <div className="info-item">
              <strong>🕐 Business Hours:</strong>
              <p>8:00 AM - 9:00 PM (Every day)</p>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send us a message</h2>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="your.email@example.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" placeholder="0123456789" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows={5} placeholder="How can we help you?" required></textarea>
              </div>
              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </div>
        </div>

        <div className="back-link">
          <Link href="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

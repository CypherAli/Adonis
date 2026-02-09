"use client"

import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="deals-page">
      <div className="container">
        <h1>📞 Contact</h1>
        <p className="deals-description">Get in touch with us!</p>
        
        <div className="deals-coming-soon">
          <div className="coming-soon-icon">📧</div>
          <h2>Contact Information</h2>
          <p style={{ marginBottom: '15px' }}>
            <strong>Phone:</strong> 084.686.5650<br/>
            <strong>Email:</strong> trinhviethoangawm@gmail.com
          </p>
          <Link href="/contact" className="btn-back-home">
            Full Contact Page
          </Link>
        </div>
      </div>
    </div>
  )
}

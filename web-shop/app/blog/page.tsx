"use client"

import Link from 'next/link'

export default function BlogPage() {
  return (
    <div className="deals-page">
      <div className="container">
        <h1> Blog & News</h1>
        <p className="deals-description">
          Stay updated with the latest shoe trends and fashion tips!
        </p>
        
        <div className="deals-coming-soon">
          <div className="coming-soon-icon"></div>
          <h2>Coming Soon!</h2>
          <p>We're working on bringing you interesting content. Check back later!</p>
          <Link href="/" className="btn-back-home">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

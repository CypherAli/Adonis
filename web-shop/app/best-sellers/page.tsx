"use client"

import Link from 'next/link'

export default function BestSellersPage() {
  return (
    <div className="deals-page">
      <div className="container">
        <h1>⭐ Best Sellers</h1>
        <p className="deals-description">
          Check out our most popular products!
        </p>
        
        <div className="deals-coming-soon">
          <div className="coming-soon-icon">🏆</div>
          <h2>Coming Soon!</h2>
          <p>We're curating the best sellers for you. Stay tuned!</p>
          <Link href="/" className="btn-back-home">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

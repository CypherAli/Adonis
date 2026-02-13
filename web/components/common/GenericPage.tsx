"use client"

import Link from 'next/link'

export default function GenericPage({ 
  title, 
  icon = "📄" 
}: { 
  title: string
  icon?: string 
}) {
  return (
    <div className="deals-page">
      <div className="container">
        <h1>{icon} {title}</h1>
        
        <div className="deals-coming-soon">
          <div className="coming-soon-icon">🚧</div>
          <h2>Coming Soon!</h2>
          <p>This page is under construction. We'll have it ready soon!</p>
          <Link href="/" className="btn-back-home">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import '../tin-tuc.css'

interface NewsDetail {
  _id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  author: { name: string; avatar?: string } | string
  tags?: string[]
  status: string
  publishedAt?: Date
  viewCount: number
  createdAt: Date
}

export default function NewsDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [article, setArticle] = useState<NewsDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) fetchArticle()
  }, [slug])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
      const res = await fetch(`${API_URL}/api/news/${slug}`)

      if (res.ok) {
        const data = await res.json()
        setArticle(data)
      } else {
        setError('Không tìm thấy bài viết')
      }
    } catch (err) {
      console.error('Error fetching article:', err)
      setError('Không thể tải bài viết')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="news-page">
        <div className="container">
          <div className="loading-state">Đang tải bài viết...</div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="news-page">
        <div className="container">
          <div className="news-coming-soon">
            <h2>{error || 'Không tìm thấy bài viết'}</h2>
            <Link href="/tin-tuc" className="btn-back-home">
              ← Quay lại tin tức
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const authorName = typeof article.author === 'object' ? article.author?.name : (article.author || 'Admin')

  return (
    <div className="news-page">
      <div className="container">
        <div className="news-detail-breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span> / </span>
          <Link href="/tin-tuc">Tin tức</Link>
          <span> / </span>
          <span>{article.title}</span>
        </div>

        <article className="news-detail">
          {article.coverImage && (
            <div className="news-detail-cover">
              <img src={article.coverImage} alt={article.title} />
            </div>
          )}

          <h1 className="news-detail-title">{article.title}</h1>

          <div className="news-detail-meta">
            <span>✍️ {authorName}</span>
            <span>📅 {new Date(article.publishedAt || article.createdAt).toLocaleDateString('vi-VN')}</span>
            <span>👁️ {article.viewCount} lượt xem</span>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="news-detail-tags">
              {article.tags.map((tag) => (
                <span key={tag} className="news-tag">#{tag}</span>
              ))}
            </div>
          )}

          <div
            className="news-detail-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        <div className="news-detail-footer">
          <Link href="/tin-tuc" className="btn-back-home">
            ← Quay lại tin tức
          </Link>
        </div>
      </div>
    </div>
  )
}

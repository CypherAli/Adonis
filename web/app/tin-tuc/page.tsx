"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import './tin-tuc.css'

interface NewsItem {
  _id: string
  slug: string
  title: string
  summary: string
  content: string
  thumbnail?: string
  author: string
  isPublished: boolean
  publishedAt?: Date
  viewCount: number
  createdAt: Date
}

export default function TinTucPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchNews()
  }, [page])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
      const res = await fetch(`${API_URL}/api/news?page=${page}&limit=12`)
      
      if (res.ok) {
        const data = await res.json()
        setNews(data.news || [])
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && page === 1) {
    return (
      <div className="news-page">
        <div className="container">
          <h1>📰 Tin Tức & Sự Kiện</h1>
          <div className="loading-state">Đang tải tin tức...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="news-page">
      <div className="container">
        <h1>📰 Tin Tức & Sự Kiện</h1>
        <p className="news-description">
          Cập nhật những tin tức mới nhất về sản phẩm, khuyến mãi và xu hướng thời trang
        </p>

        {news.length === 0 ? (
          <div className="news-coming-soon">
            <div className="coming-soon-icon">🚧</div>
            <h2>Coming Soon!</h2>
            <p>Chúng tôi đang chuẩn bị những nội dung thú vị. Hãy quay lại sau!</p>
            <Link href="/" className="btn-back-home">
              Về Trang Chủ
            </Link>
          </div>
        ) : (
          <>
            <div className="news-grid">
              {news.map((item) => (
                <Link href={`/tin-tuc/${item.slug}`} key={item._id} className="news-card">
                  {item.thumbnail && (
                    <div className="news-thumbnail">
                      <img src={item.thumbnail} alt={item.title} />
                    </div>
                  )}
                  <div className="news-content">
                    <h3>{item.title}</h3>
                    <p className="news-summary">{item.summary}</p>
                    <div className="news-meta">
                      <span>{item.author}</span>
                      <span>👁️ {item.viewCount}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-page"
                >
                  ← Trang trước
                </button>
                <span className="page-info">
                  Trang {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-page"
                >
                  Trang sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

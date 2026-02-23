"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import './tin-tuc.css'
import { getNewsList, type NewsItem } from '@/lib/api/news'

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
      const data = await getNewsList(page, 12)
      setNews(data.news || [])
      setTotalPages(data.pagination?.totalPages || 1)
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
              {news.map((item) => {
                const authorName = typeof item.author === 'object' ? item.author?.name : (item.author || 'Admin')
                return (
                  <Link href={`/tin-tuc/${item.slug}`} key={item._id} className="news-card">
                    {item.coverImage && (
                      <div className="news-thumbnail">
                        <img src={item.coverImage} alt={item.title} />
                      </div>
                    )}
                    <div className="news-content">
                      <h3>{item.title}</h3>
                      <p className="news-summary">{item.excerpt}</p>
                      <div className="news-meta">
                        <span>{authorName}</span>
                        <span>👁️ {item.viewCount}</span>
                        <span>{new Date(item.publishedAt || item.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
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

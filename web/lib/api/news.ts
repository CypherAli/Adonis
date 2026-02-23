/**
 * News API
 * Dùng được trong cả Client Components và Server Components
 */

import apiClient from './api_client'

export interface NewsItem {
  _id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  author: { name: string; avatar?: string } | string
  tags?: string[]
  status: string
  publishedAt?: string
  viewCount: number
  createdAt: string
}

export interface NewsListResult {
  news: NewsItem[]
  pagination: {
    page: number
    totalPages: number
    total: number
  }
}

export async function getNewsList(page = 1, limit = 12): Promise<NewsListResult> {
  const res = await apiClient.get<NewsListResult>('/news', {
    params: { page, limit },
  })
  return res.data
}

export async function getNewsArticle(slug: string): Promise<NewsItem> {
  const res = await apiClient.get<NewsItem>(`/news/${slug}`)
  return res.data
}

'use client'

import Link from 'next/link'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt } from 'react-icons/fa'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4">
              <span className="text-orange-500">Shoe</span> Store
            </h3>
            <p className="text-sm leading-relaxed">
              Hệ thống bán lẻ giày uy tín hàng đầu Việt Nam
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-sm">Hà Nội, Việt Nam</span>
              </div>
              
              <div className="flex items-center gap-3">
                <FaPhone className="text-orange-500 flex-shrink-0" />
                <a href="tel:0848565650" className="text-sm hover:text-orange-500 transition-colors">
                  084.686.5650
                </a>
              </div>
              
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-orange-500 mt-1 flex-shrink-0" />
                <a href="mailto:trinhviethoangawm@gmail.com" className="text-sm hover:text-orange-500 transition-colors break-all">
                  trinhviethoangawm@gmail.com
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <FaClock className="text-orange-500 flex-shrink-0" />
                <span className="text-sm">8:00 - 21:00 (Thứ 2 - CN)</span>
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/huong-dan-mua-hang" className="text-sm hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="text-orange-500">▸</span>
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link href="/huong-dan-thanh-toan" className="text-sm hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="text-orange-500">▸</span>
                  Hướng dẫn thanh toán
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-hanh" className="text-sm hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="text-orange-500">▸</span>
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-doi-tra" className="text-sm hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="text-orange-500">▸</span>
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-van-chuyen" className="text-sm hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="text-orange-500">▸</span>
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/tra-gop" className="text-sm hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="text-orange-500">▸</span>
                  Hướng dẫn trả góp 0%
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
              Về chúng tôi
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/gioi-thieu" className="text-sm hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="text-orange-500">▸</span>
                  Giới thiệu công ty
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="text-orange-500">▸</span>
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/tuyen-dung" className="text-sm hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="text-orange-500">▸</span>
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="/tin-tuc" className="text-sm hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="text-orange-500">▸</span>
                  Tin tức & Sự kiện
                </Link>
              </li>
              <li>
                <Link href="/he-thong-cua-hang" className="text-sm hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="text-orange-500">▸</span>
                  Hệ thống cửa hàng
                </Link>
              </li>
              <li>
                <Link href="/dieu-khoan" className="text-sm hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="text-orange-500">▸</span>
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment & Newsletter */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
              Phương thức thanh toán
            </h4>
            
            {/* Payment Icons Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-lg p-2 flex items-center justify-center h-12 hover:shadow-lg transition-shadow">
                <span className="text-blue-600 font-bold text-xs">VISA</span>
              </div>
              <div className="bg-white rounded-lg p-2 flex items-center justify-center h-12 hover:shadow-lg transition-shadow">
                <span className="text-red-600 font-bold text-xs">MasterCard</span>
              </div>
              <div className="bg-white rounded-lg p-2 flex items-center justify-center h-12 hover:shadow-lg transition-shadow">
                <span className="text-blue-700 font-bold text-xs">ATM</span>
              </div>
              <div className="bg-white rounded-lg p-2 flex items-center justify-center h-12 hover:shadow-lg transition-shadow">
                <span className="text-pink-600 font-bold text-xs">MoMo</span>
              </div>
              <div className="bg-white rounded-lg p-2 flex items-center justify-center h-12 hover:shadow-lg transition-shadow">
                <span className="text-blue-500 font-bold text-xs">ZaloPay</span>
              </div>
              <div className="bg-white rounded-lg p-2 flex items-center justify-center h-12 hover:shadow-lg transition-shadow">
                <span className="text-green-600 font-bold text-xs">COD</span>
              </div>
            </div>

            {/* Newsletter */}
            <h4 className="text-lg font-bold text-white mb-3">Đăng ký nhận tin</h4>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email của bạn"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 text-sm"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © 2026 Shoe Store. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={20} />
              </a>
            </div>

            {/* Certifications */}
            <div className="flex items-center gap-3">
              <div className="bg-white rounded px-2 py-1">
                <span className="text-xs font-semibold text-gray-800">DMCA Protected</span>
              </div>
              <div className="bg-white rounded px-2 py-1">
                <span className="text-xs font-semibold text-green-600">✓ SSL Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

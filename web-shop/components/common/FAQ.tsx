"use client"

import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import './FAQ.css'

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={onToggle}>
        <span>{question}</span>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      <div className={`faq-answer ${isOpen ? 'show' : ''}`}>
        <p>{answer}</p>
      </div>
    </div>
  )
}

interface FAQProps {
  faqs: Array<{ question: string; answer: string }>
  initialShowCount?: number
}

const FAQ = ({ faqs, initialShowCount = 4 }: FAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const toggleShowAll = () => {
    setShowAll(!showAll)
    if (showAll) {
      // Scroll to FAQ section when collapsing
      const faqSection = document.querySelector('.faq-section')
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // Default FAQs if none provided
  const defaultFAQs = [
    {
      question: '⏰ Thời gian giao hàng là bao lâu?',
      answer:
        'Giao hàng nhanh trong 2-4 giờ (nội thành) hoặc 1-3 ngày (tỉnh khác). Miễn phí ship cho đơn trên 5 triệu.',
    },
    {
      question: '↩️ What is the return policy?',
      answer:
        'Đổi trả miễn phí trong 15 ngày đối với lỗi từ nhà sản xuất. Yêu cầu sản phẩm còn nguyên vẹn.',
    },
    {
      question: '🛡️ Bảo hành được thực hiện như thế nào?',
      answer: 'Official warranty 12-36 months. Warranty support at manufacturer or our store.',
    },
    {
      question: '💳 Do you support 0% installment?',
      answer:
        'Yes, we support 0% installment via credit card for orders from 3 million, 3-12 month terms.',
    },
    {
      question: '📦 Tôi có thể kiểm tra hàng trước khi nhận không?',
      answer: 'Bạn được đồng kiểm, test máy khi nhận hàng và có thể từ chối nếu không hài lòng.',
    },
    {
      question: '🎁 Làm thế nào để nhận được khuyến mãi?',
      answer:
        'Theo dõi mục "Khuyến mãi Hot" hoặc fanpage của chúng tôi để nhận thông tin ưu đãi mới nhất.',
    },
    {
      question: '📞 How can I contact support?',
      answer: '24/7 support via Hotline 084.686.5650, Email, or Live Chat directly on the website.',
    },
    {
      question: '🔒 Thông tin cá nhân của tôi có được bảo mật không?',
      answer:
        'Chúng tôi cam kết bảo mật 100% thông tin của bạn bằng mã hóa SSL. Dữ liệu chỉ dùng cho việc giao hàng.',
    },
  ]

  const faqList = faqs || defaultFAQs
  const displayedFAQs = showAll ? faqList : faqList.slice(0, initialShowCount)
  const hasMore = faqList.length > initialShowCount

  return (
    <div className="faq-section">
      <div className="faq-header">
        <h2 className="faq-title">❓ Câu Hỏi Thường Gặp</h2>
        <p className="faq-subtitle">Tìm câu trả lời cho những thắc mắc phổ biến</p>
      </div>
      <div className="faq-list">
        {displayedFAQs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onToggle={() => toggleFAQ(index)}
          />
        ))}
      </div>
      {hasMore && (
        <div className="faq-show-more">
          <button className="faq-show-more-btn" onClick={toggleShowAll}>
            {showAll ? (
              <>
                <FiChevronUp /> Rút gọn
              </>
            ) : (
              <>
                <FiChevronDown /> Xem thêm {faqList.length - initialShowCount} câu hỏi
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default FAQ

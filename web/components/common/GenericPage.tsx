import Link from 'next/link'

interface PolicySection {
  title: string
  content: string | string[]
}

interface GenericPageProps {
  title: string
  icon?: string
  description?: string
  sections?: PolicySection[]
  lastUpdated?: string
}

export default function GenericPage({
  title,
  icon = '📄',
  description,
  sections,
  lastUpdated,
}: GenericPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{icon}</span>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
          {description && (
            <p className="text-gray-600 text-lg">{description}</p>
          )}
          {lastUpdated && (
            <p className="text-sm text-gray-400 mt-2">Cập nhật lần cuối: {lastUpdated}</p>
          )}
        </div>

        {/* Content Sections */}
        {sections && sections.length > 0 ? (
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                {Array.isArray(section.content) ? (
                  <ul className="space-y-2 text-gray-700 leading-relaxed">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500">Nội dung đang được cập nhật.</p>
          </div>
        )}

        {/* Back */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}

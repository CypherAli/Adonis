export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Skeleton */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 animate-pulse">
          <div className="relative h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300"></div>
            </div>
          </div>
          <div className="pt-16 px-6 pb-4">
            <div className="h-8 w-48 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="h-6 w-12 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex border-b animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 px-6 py-4">
                <div className="h-4 w-20 bg-gray-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

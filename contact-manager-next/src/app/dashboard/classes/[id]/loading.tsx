export default function LoadingPage() {
  return (
    <div>
      <div className="mb-6">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="mb-8">
          <div className="flex space-x-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="h-5 w-36 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

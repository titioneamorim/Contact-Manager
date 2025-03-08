export default function LoadingPage() {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-9 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex justify-between items-end">
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state placeholder */}
      <div className="hidden">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-3"></div>
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

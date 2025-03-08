export default function LoadingPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>

        <div className="space-y-6">
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="flex justify-end space-x-4">
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-9 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

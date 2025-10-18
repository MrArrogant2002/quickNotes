import { Spinner, SkeletonCard } from "@/components/ui/spinner"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4EEFF] via-[#DCD6F7] to-[#A6B1E1] dark:from-gray-900 dark:via-[#424874] dark:to-gray-950">
      {/* Header Skeleton */}
      <header className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
              <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="w-11 h-11 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Create Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 h-12 bg-white/80 dark:bg-gray-800/80 rounded-lg animate-pulse"></div>
          <div className="h-12 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Message */}
        <div className="text-center py-12">
          <Spinner size="lg" className="text-[#A6B1E1] mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading your notes...</p>
        </div>

        {/* Note Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  )
}

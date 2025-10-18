import { Spinner } from "@/components/ui/spinner"

export default function NoteLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4EEFF] via-[#DCD6F7] to-[#A6B1E1] dark:from-gray-900 dark:via-[#424874] dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Skeleton */}
        <div className="mb-8 flex items-center justify-between">
          <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="flex gap-3">
            <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Note Editor Card Skeleton */}
        <div className="border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-lg">
          <div className="border-b border-slate-200 dark:border-slate-700 p-6">
            <div className="space-y-6">
              {/* Title Skeleton */}
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              
              {/* Tags Skeleton */}
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
              </div>

              {/* Metadata Skeleton */}
              <div className="flex items-center gap-6 text-sm">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Editor Skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6 animate-pulse"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-center py-12">
          <Spinner size="lg" className="text-[#A6B1E1] mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading note...</p>
        </div>
      </div>
    </div>
  )
}

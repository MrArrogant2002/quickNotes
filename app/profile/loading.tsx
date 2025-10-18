import { Spinner } from "@/components/ui/spinner"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4EEFF] via-[#DCD6F7] to-[#A6B1E1] dark:from-gray-900 dark:via-[#424874] dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button Skeleton */}
        <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-6"></div>

        {/* Profile Header Skeleton */}
        <div className="mb-8 border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-28 h-28 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
            
            <div className="flex-1 space-y-4 w-full">
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-64 mx-auto md:mx-0 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mx-auto md:mx-0 animate-pulse"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40 mx-auto md:mx-0 animate-pulse"></div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-center bg-slate-200 dark:bg-slate-700 rounded-xl px-6 py-4 w-24 h-24 animate-pulse"></div>
              <div className="text-center bg-slate-200 dark:bg-slate-700 rounded-xl px-6 py-4 w-24 h-24 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-center py-12">
          <Spinner size="lg" className="text-[#A6B1E1] mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading your profile...</p>
        </div>
      </div>
    </div>
  )
}

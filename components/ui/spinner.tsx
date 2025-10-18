import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-current border-r-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
    </div>
  )
}

export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl flex flex-col items-center gap-4">
        <Spinner size="lg" className="text-[#A6B1E1]" />
        <p className="text-slate-600 dark:text-slate-300 font-medium">{message}</p>
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="border border-slate-200/50 dark:border-slate-700/50 rounded-lg p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  )
}

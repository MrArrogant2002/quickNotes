"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function TopLoadingBar() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    setProgress(0)

    // Simulate loading progress
    const timer1 = setTimeout(() => setProgress(30), 100)
    const timer2 = setTimeout(() => setProgress(60), 300)
    const timer3 = setTimeout(() => setProgress(90), 600)
    const timer4 = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setLoading(false), 200)
    }, 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#A6B1E1] via-[#8B9FD9] to-[#424874] transition-all duration-300 ease-out shadow-lg shadow-[#A6B1E1]/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

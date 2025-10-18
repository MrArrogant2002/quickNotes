"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log("🔐 Login attempt started")
    console.log("📧 Email:", formData.email)
    console.log("🔑 Password length:", formData.password.length)

    try {
      console.log("📡 Calling signIn...")
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      console.log("📥 SignIn result:", result)

      if (result?.error) {
        console.error("❌ Login failed:", result.error)
        toast.error("Invalid email or password")
      } else if (result?.ok) {
        console.log("✅ Login successful!")
        toast.success("Welcome back!")
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("💥 Login error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
      console.log("🏁 Login attempt finished")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4EEFF] via-[#DCD6F7] to-[#A6B1E1] dark:from-gray-900 dark:via-[#424874] dark:to-gray-950 p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#424874] dark:hover:text-[#A6B1E1] mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-[#A6B1E1] focus:ring-offset-2 rounded-md"
          aria-label="Go back to home page"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to home
        </Link>

        <Card className="border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl shadow-[#A6B1E1]/10" role="main">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#A6B1E1] to-[#424874] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#A6B1E1]/30">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#A6B1E1] to-[#424874] bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base text-slate-600 dark:text-slate-400">
              Enter your credentials to access your notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5" aria-label="Login form">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-11 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#A6B1E1]/50"
                  aria-required="true"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="h-11 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#A6B1E1]/50"
                  aria-required="true"
                  aria-describedby="password-hint"
                  autoComplete="current-password"
                />
                <p id="password-hint" className="sr-only">Password must be at least 6 characters</p>
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-[#A6B1E1] to-[#424874] hover:from-[#8B9FD9] hover:to-[#333561] text-white shadow-lg shadow-[#A6B1E1]/30 hover:shadow-[#A6B1E1]/50 transition-all duration-300 focus:ring-2 focus:ring-[#A6B1E1] focus:ring-offset-2" 
                disabled={isLoading}
                aria-label={isLoading ? "Signing in, please wait" : "Sign in to your account"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pb-6">
            <div className="text-sm text-center text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <Link 
                href="/register" 
                className="text-[#424874] hover:text-[#333561] dark:text-[#A6B1E1] dark:hover:text-[#8B9FD9] hover:underline font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#A6B1E1] rounded"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

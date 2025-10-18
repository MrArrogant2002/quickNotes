"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Registration failed")
        return
      }

      toast.success("Account created successfully! Please sign in.")
      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4EEFF] via-[#DCD6F7] to-[#A6B1E1] dark:from-gray-900 dark:via-[#424874] dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#424874] dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <Card className="border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#A6B1E1] to-[#424874] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#A6B1E1]/30">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#A6B1E1] to-[#424874] bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-base text-slate-600 dark:text-slate-400">
              Start organizing your thoughts in seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                  minLength={2}
                  className="h-11 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
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
                  className="h-11 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/50"
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
                  className="h-11 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/50"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Minimum 6 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                type="password"
                placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="h-11 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* Features List */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  What you'll get:
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Unlimited notes with rich text editing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Smart tagging and powerful search</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Secure encryption and privacy</span>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-[#A6B1E1] to-[#424874] hover:from-[#8B9FD9] hover:to-[#333561] text-white shadow-lg shadow-[#A6B1E1]/30 hover:shadow-[#A6B1E1]/50 transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pb-6">
            <div className="text-sm text-center text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-[#424874] hover:text-[#333561] dark:text-[#A6B1E1] dark:hover:text-[#8B9FD9] hover:underline font-semibold transition-colors">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

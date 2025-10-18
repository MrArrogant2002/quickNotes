import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Lock, 
  Zap, 
  Sparkles, 
  Search, 
  Tag, 
  Smartphone,
  ArrowRight,
  CheckCircle2
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4EEFF] via-[#DCD6F7] to-[#A6B1E1] dark:from-gray-900 dark:via-[#424874] dark:to-gray-950">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#A6B1E1] to-[#424874] rounded-lg flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#A6B1E1] to-[#424874] bg-clip-text text-transparent">
              QuickNotes
            </span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-white/50 dark:hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-[#A6B1E1] to-[#424874] hover:from-[#8B9FD9] hover:to-[#333561] text-white shadow-lg shadow-[#A6B1E1]/30">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <Badge className="bg-[#DCD6F7] text-[#424874] dark:bg-[#424874] dark:text-[#DCD6F7] border-0 px-4 py-1.5">
            <Sparkles className="w-4 h-4 mr-1" />
            Production-Ready Note Taking
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Your Ideas,
            <br />
            <span className="bg-gradient-to-r from-[#A6B1E1] via-[#8B9FD9] to-[#424874] bg-clip-text text-transparent animate-gradient">
              Beautifully Organized
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Create, organize, and manage your notes with powerful rich text editing, 
            smart tagging, and lightning-fast search. Built for productivity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-[#A6B1E1] to-[#424874] hover:from-[#8B9FD9] hover:to-[#333561] text-white text-lg px-8 py-6 shadow-2xl shadow-[#A6B1E1]/30 hover:shadow-[#A6B1E1]/50 transition-all duration-300 hover:scale-105">
                Start Free Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-white dark:hover:bg-white/10 transition-all duration-300">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 justify-center items-center text-sm text-slate-600 dark:text-slate-400 pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Secure & private</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="group hover:shadow-2xl hover:shadow-[#A6B1E1]/20 transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="pt-8 space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#A6B1E1] to-[#8B9FD9] rounded-2xl flex items-center justify-center shadow-lg shadow-[#A6B1E1]/30 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Rich Text Editor</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Create beautifully formatted notes with bold, italic, lists, links, and more. 
                Professional WYSIWYG editing experience.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-[#424874]/20 transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="pt-8 space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#424874] to-[#333561] rounded-2xl flex items-center justify-center shadow-lg shadow-[#424874]/30 group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Secure & Private</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Your notes are protected with industry-standard encryption, secure authentication, 
                and private by default.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-[#DCD6F7]/20 transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="pt-8 space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#DCD6F7] to-[#A6B1E1] rounded-2xl flex items-center justify-center shadow-lg shadow-[#DCD6F7]/30 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-[#424874]" />
              </div>
              <h3 className="text-2xl font-bold">Lightning Fast</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Built on Next.js 15 for blazing-fast performance. Instant search and 
                seamless navigation.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-[#A6B1E1]/20 transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="pt-8 space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#A6B1E1] to-[#424874] rounded-2xl flex items-center justify-center shadow-lg shadow-[#A6B1E1]/30 group-hover:scale-110 transition-transform duration-300">
                <Tag className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Smart Tags</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Organize your notes with tags for easy categorization and quick filtering. 
                Stay organized effortlessly.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-[#424874]/20 transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="pt-8 space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#424874] to-[#333561] rounded-2xl flex items-center justify-center shadow-lg shadow-[#424874]/30 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Powerful Search</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Find anything instantly with our powerful search across titles, content, and tags. 
                Never lose a note.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-[#DCD6F7]/20 transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="pt-8 space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#DCD6F7] to-[#A6B1E1] rounded-2xl flex items-center justify-center shadow-lg shadow-[#DCD6F7]/30 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="w-7 h-7 text-[#424874]" />
              </div>
              <h3 className="text-2xl font-bold">Fully Responsive</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Access your notes from any device. Beautiful design that works perfectly 
                on desktop, tablet, and mobile.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[#A6B1E1] via-[#8B9FD9] to-[#424874] rounded-3xl p-12 shadow-2xl shadow-[#A6B1E1]/30">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who are already organizing their thoughts with QuickNotes.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#424874] hover:bg-white/90 text-lg px-8 py-6 shadow-xl hover:scale-105 transition-all duration-300">
                Create Your Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-20 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center text-slate-600 dark:text-slate-400">
          <p className="text-lg">
            Made with ❤️ using <span className="text-[#424874] dark:text-[#A6B1E1] font-semibold">Next.js 15</span>, <span className="text-[#424874] dark:text-[#A6B1E1] font-semibold">React 19</span>, and <span className="text-[#424874] dark:text-[#A6B1E1] font-semibold">TypeScript</span>
          </p>
          <p className="mt-2 text-sm">
            © 2025 QuickNotes. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

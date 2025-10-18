import Link from "next/link"

// TODO: Implement note sharing feature - requires shareToken and isPublic fields in Note model
// Temporarily disabled to make the app deployable

export default async function SharedNotePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  // Feature temporarily disabled
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4EEFF] via-[#DCD6F7] to-[#A6B1E1]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-xl p-8">
            <div className="mb-6 text-center">
              <h1 className="text-4xl font-bold mb-4 text-slate-900">
                Note Sharing Coming Soon
              </h1>
              <p className="text-slate-600 mb-6">
                The note sharing feature is currently under development.
              </p>
              <p className="text-sm text-slate-500">
                Share Token: {token}
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link 
                href="/" 
                className="inline-block px-6 py-3 bg-gradient-to-r from-[#A6B1E1] to-[#424874] text-white rounded-lg hover:from-[#8B9FD9] hover:to-[#333561] transition-all"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

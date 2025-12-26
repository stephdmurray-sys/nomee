import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-near-black mb-3">Profile not found</h1>
        <p className="text-soft-gray-text mb-6">
          We couldn't find the profile you're looking for. It may have been moved or doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-quiet-indigo text-white rounded-full hover:bg-quiet-indigo/90 transition-colors"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  )
}

import { ShieldX } from 'lucide-react'
import { Link } from 'react-router-dom'

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <ShieldX className="w-16 h-16 text-maroon-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">
          You don't have permission to access this section.
        </p>
        <Link
          to="/dashboard"
          className="bg-maroon-500 hover:bg-maroon-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

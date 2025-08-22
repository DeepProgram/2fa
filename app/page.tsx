'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [secretKey, setSecretKey] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (secretKey.trim()) {
      // Navigate to the 2FA show page
      window.location.href = `/2fa/show/${encodeURIComponent(secretKey.trim())}`
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            2FA Code Viewer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your 2FA secret key to view the current code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              2FA Secret Key
            </label>
            <input
              id="secretKey"
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter your 2FA secret key (e.g., JBSWY3DPEHPK3PXP)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            View 2FA Code
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Or use the direct URL format:</p>
          <p className="font-mono text-xs mt-1">
            /2fa/show/[your-secret-key]
          </p>
        </div>
      </div>
    </main>
  )
}

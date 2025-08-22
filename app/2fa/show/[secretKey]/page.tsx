'use client'

import { useState, useEffect } from 'react'
import { authenticator } from 'otplib'
import Link from 'next/link'

interface PageProps {
  params: {
    secretKey: string
  }
}

export default function Show2FAPage({ params }: PageProps) {
  const [currentCode, setCurrentCode] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number>(30)
  const [isValidSecret, setIsValidSecret] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const decodedSecretKey = decodeURIComponent(params.secretKey)

  useEffect(() => {
    try {
      // Validate the secret key by trying to generate a token
      const token = authenticator.generate(decodedSecretKey)
      if (token) {
        setIsValidSecret(true)
        setError('')
        updateCode()
      }
    } catch (err) {
      setIsValidSecret(false)
      setError('Invalid 2FA secret key format')
    }
  }, [decodedSecretKey])

  useEffect(() => {
    if (!isValidSecret) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          updateCode()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isValidSecret])

  const updateCode = () => {
    try {
      const code = authenticator.generate(decodedSecretKey)
      setCurrentCode(code)
    } catch (err) {
      setError('Failed to generate 2FA code')
    }
  }

  if (!isValidSecret) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Invalid Secret Key
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'The provided 2FA secret key is not valid.'}
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
          >
            Go Back
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            2FA Code
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Current code for your 2FA secret
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider">
              {currentCode}
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Code refreshes in {timeLeft} seconds
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={updateCode}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Refresh Now
          </button>

          <Link
            href="/"
            className="inline-block w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Enter New Secret Key
          </Link>
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Secret Key: {decodedSecretKey}</p>
          <p className="mt-2">
            <strong>Note:</strong> Keep your secret key secure and don't share it with anyone.
          </p>
        </div>
      </div>
    </main>
  )
}

'use client'
import CheckoutPage from '@/components/Home/Cart/CheckoutPage/CheckoutPage'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const Page = () => {
    const searchParams = useSearchParams()
  const amountParam = searchParams.get('amount')
  const amount = amountParam ? parseInt(amountParam, 10) : 1000 // fallback 1000
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Checkout</h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CheckoutPage amount={amount} /> {/* Amount in cents: $10.00 */}
          </div>
        </div>
      </div>
  )
}

export default Page
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

type OrderItem = {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

type Order = {
  id: number
  totalAmount: number
  currency: string
  status: string
  createdAt: string
  items: OrderItem[]
}

export default function Page() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', { credentials: 'include' })
        if (!res.ok) {
          if (res.status === 401) {
            setError('Please login to view your orders.')
            setOrders([])
            return
          }
          throw new Error('Failed to load orders')
        }
        const data = await res.json()
        setOrders(data.orders ?? [])
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) return <p className="p-4">Loading orders...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>
  if (!orders || orders.length === 0) return <p className="p-4">You have no orders yet.</p>

  return (
    <div className="p-6 space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-md p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-slate-500">Order #{order.id}</div>
              <div className="text-sm text-slate-400">{new Date(order.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">₹{(order.totalAmount / 100).toFixed(2)}</div>
              <div className="text-sm text-slate-500">{order.status}</div>
            </div>
          </div>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                  <Image src={item.image} alt={item.title} width={64} height={64} className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{item.title}</div>
                  <div className="text-sm text-slate-500">Qty: {item.quantity}</div>
                </div>
                <div className="text-sm font-semibold">₹{(item.price / 100).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
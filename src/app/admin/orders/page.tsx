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
  userId: number
  totalAmount: number
  currency: string
  status: string
  createdAt: string
  user: { name: string; email: string }
  items: OrderItem[]
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await fetch('/api/admin/orders', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to load orders')
        const data = await res.json()
        setOrders(data.orders ?? [])
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }
    fetchAllOrders()
  }, [])

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })
      console.log(res);
      
      if (!res.ok) throw new Error('Failed to update order')
      const data = await res.json()
    console.log(data);
    
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    } catch (err: any) {
      alert(err?.message || 'Error updating order')
    }
  }

  if (loading) return <p className="p-4">Loading orders...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>
  if (orders.length === 0) return <p className="p-4">No orders found.</p>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="grid grid-cols-4 gap-4 items-center mb-4">
            <div>
              <div className="text-sm text-slate-500">Order #{order.id}</div>
              <div className="font-semibold">{order.user?.name || 'N/A'}</div>
              <div className="text-xs text-slate-400">{order.user?.email}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Date</div>
              <div className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Total</div>
              <div className="font-semibold">₹{(order.totalAmount / 100).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Status</div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="font-semibold border border-gray-300 rounded px-2 py-1"
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="FAILED">FAILED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                  <Image src={item.image} alt={item.title} width={48} height={48} className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500">Qty: {item.quantity}</div>
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

export default Orders
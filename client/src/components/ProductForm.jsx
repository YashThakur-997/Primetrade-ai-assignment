import React, { useState } from 'react'
import api from '@/services/api'
import { useUser } from '@/context/UserContext'

// 1. Accept a callback prop from the parent dashboard component
export default function ProductForm({ onProductCreated }) {
  const { user } = useUser()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')

  // Rule of Hooks: Early returns MUST come after all hooks, 
  // but since we removed useEffect, this placement is now safe.
  if (user?.role !== 'admin') {
    return (
      <div className="p-4 border-2 border-dashed border-gray-300 rounded text-gray-600">
        🔒 Component Locked: Admin Privileges Required.
      </div>
    )
  }

  // 2. Keep the event handler outside of any hooks
  async function submit(e) {
    e.preventDefault()
    try {
      await api.post('/products', { name, price: Number(price), description })
      alert('Product created')
      
      // 3. Tell the parent list to update its state dynamically
      if (onProductCreated) {
        onProductCreated()
      }

      // Reset form fields
      setName('')
      setPrice('')
      setDescription('')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create product')
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-3">Create Product</h3>
      <div className="mb-3">
        <input required className="w-full px-3 py-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      </div>
      <div className="mb-3">
        <input required type="number" className="w-full px-3 py-2 border rounded" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
      </div>
      <div className="mb-3">
        <textarea className="w-full px-3 py-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create</button>
    </form>
  )
}
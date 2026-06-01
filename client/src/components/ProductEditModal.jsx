import React, { useState } from 'react'

export default function ProductEditModal({ product, onClose, onSave, saving }) {
  const [name, setName] = useState(product?.name || '')
  const [price, setPrice] = useState(product?.price || '')
  const [description, setDescription] = useState(product?.description || '')

  function submit(e) {
    e.preventDefault()
    onSave({ name, price: Number(price), description })
  }

  if (!product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="w-full px-3 py-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Price</label>
            <input className="w-full px-3 py-2 border rounded" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full px-3 py-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" disabled={saving} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

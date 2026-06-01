import React, { useEffect, useState } from 'react'
import api from '@/services/api'
import { useUser } from '@/context/UserContext'
import ProductEditModal from './ProductEditModal'

export default function ProductGrid() {
  const [products, setProducts] = useState([])
  const { user } = useUser()

  useEffect(() => {
    let mounted = true

    async function fetchProducts() {
      try {
        const data = await api.get('/products')
        const list = data?.data || []
        if (mounted) setProducts(list)
      } catch (err) {
        // ignore for now
      }
    }

    fetchProducts()

    return () => (mounted = false)
  }, [])

  async function buy(productId) {
    try {
      await api.post('/orders', { productId, quantity: 1 })
      alert('Order placed')
    } catch (e) {
      alert('Failed to place order')
    }
  }

  async function handleDelete(productId) {
    if (!confirm('Delete this product?')) return
    try {
      await api.del(`/products/${productId}`)
      // refresh list
      const data = await api.get('/products')
      setProducts(data?.data || [])
    } catch (e) {
      alert('Failed to delete product')
    }
  }
  const [editingProduct, setEditingProduct] = useState(null)
  const [saving, setSaving] = useState(false)

  function openEdit(product) {
    setEditingProduct(product)
  }

  function closeEdit() {
    setEditingProduct(null)
  }

  async function handleSave(updates) {
    if (!editingProduct) return
    setSaving(true)
    try {
      await api.put(`/products/${editingProduct._id || editingProduct.id}`, updates)
      const data = await api.get('/products')
      setProducts(data?.data || [])
      setEditingProduct(null)
    } catch (e) {
      alert('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (!products.length) return <div className="p-6 text-gray-600">No products yet.</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
        <div key={p._id || p.id} className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-semibold mb-2">{p.name}</h4>
          <p className="text-sm text-gray-600 mb-3">{p.description}</p>
          <div className="mb-3">Price: <span className="font-medium">${p.price}</span></div>
          {user?.role === 'user' ? (
            <button onClick={() => buy(p._id || p.id)} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Buy Now</button>
          ) : (
            <div className="flex items-center space-x-2">
              <button onClick={() => openEdit(p)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
              <button onClick={() => handleDelete(p._id || p.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
            </div>
          )}
        </div>
      ))}
      {editingProduct && (
        <ProductEditModal product={editingProduct} onClose={closeEdit} onSave={handleSave} saving={saving} />
      )}
    </div>
  )
}

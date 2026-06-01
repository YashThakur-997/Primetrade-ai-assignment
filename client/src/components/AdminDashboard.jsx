import React from 'react'
import { useNavigate } from 'react-router-dom'
import ProductForm from './ProductForm'
import ProductGrid from './ProductGrid'
import { useUser } from '@/context/UserContext'

export default function AdminDashboard() {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
      </div>
      <p className="text-sm text-gray-600 mb-4">Signed in as: <span className="font-medium">{user?.role}</span></p>
      <ProductForm />
      <hr className="my-6" />
      <ProductGrid />
    </div>
  )
}

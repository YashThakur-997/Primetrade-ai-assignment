import React from 'react'
import { useState } from 'react'
import Admindashboard from '@/components/AdminDashboard'
import Userdashboard from '@/components/UserDashboard'
import { useUser } from '@/context/UserContext'

const Home = () => {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {user?.role === 'admin' ? <Admindashboard /> : <Userdashboard />}
      </div>
    </div>
  )
}

export default Home

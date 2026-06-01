import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '@/services/api'

const UserContext = createContext(null)

const TOKEN_KEY = api.TOKEN_KEY

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const json = atob(payload)
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

function createDemoToken(role = 'user') {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ userId: `${role}-demo`, role }))
  return `${header}.${payload}.demo-signature`
}

export function UserProvider({ children }) {
  const [token, setToken] = useState('')
  const [user, setUser] = useState({ id: null, role: 'guest' })

  useEffect(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY)
      if (t) {
        // Prevent auto-login from demo tokens created client-side during development.
        // Demo tokens end with the marker 'demo-signature'. If present, clear it so
        // users aren't silently redirected to dashboards.
        if (typeof t === 'string' && t.includes('demo-signature')) {
          localStorage.removeItem(TOKEN_KEY)
        } else {
          setToken(t)
          const p = decodeToken(t)
          if (p) setUser({ id: p.userId || null, role: p.role || 'guest' })
        }
      }
    } catch (e) {
      // ignore
    }
  }, [])

  function persist(nextToken) {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken)
      setToken(nextToken)
      const p = decodeToken(nextToken)
      setUser({ id: p?.userId || null, role: p?.role || 'guest' })
    } else {
      localStorage.removeItem(TOKEN_KEY)
      setToken('')
      setUser({ id: null, role: 'guest' })
    }
  }

  function loginWithToken(nextToken) {
    persist(nextToken)
  }

  function logout() {
    persist('')
  }

  function simulatePersona(role) {
    const demo = createDemoToken(role)
    persist(demo)
  }

  return (
    <UserContext.Provider
      value={{ token, setToken: persist, user, loginWithToken, logout, simulatePersona }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}

export default UserContext

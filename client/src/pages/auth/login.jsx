(function () {
	// placeholder to keep file recognized as module
})()

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '@/services/api'
import { useUser } from '@/context/UserContext'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [role, setRole] = useState('user')
	const { loginWithToken, simulatePersona } = useUser()
	const navigate = useNavigate()

	async function submit(e) {
		e.preventDefault()
		try {
			const res = await api.post('/auth/login', { email, password })
			if (res?.token) {
				loginWithToken(res.token)
				navigate('/home')
				return
			}
			alert('Login failed: invalid server response')
		} catch (err) {
			alert('Login failed: ' + (err.message || 'network error'))
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
			<div className="w-full max-w-md bg-white rounded-lg shadow p-6">
				<h2 className="text-2xl font-semibold mb-4">Login</h2>
				<form onSubmit={submit}>
					<div className="mb-3">
						<input className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
					</div>
					<div className="mb-3">
						<input className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
					</div>
					<button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700" type="submit">Sign in</button>
				</form>
				<div className="mt-4 text-center text-sm text-gray-600">
					Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Create one</Link>
				</div>
			</div>
		</div>
	)
}


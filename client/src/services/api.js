const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
// Key used to persist the JWT in localStorage. Keep this consistent across client modules.
const TOKEN_KEY = 'primetrade_auth_token'

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch (e) {
    return ''
  }
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${API_BASE_URL}${path}`
  const token = readToken()

  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (token) {
    opts.headers.Authorization = `Bearer ${token}`
  }

  if (body) {
    opts.body = JSON.stringify(body)
  }

  const res = await fetch(url, opts)

  if (res.status === 403) {
    alert('Access Denied: Your current role does not have authorization for this action.')
    throw new Error('403')
  }

  if (res.status === 401) {
    throw new Error('Unauthorized')
  }

  const text = await res.text()
  try {
    return text ? JSON.parse(text) : null
  } catch (e) {
    return text
  }
}

export default {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
  API_BASE_URL,
  TOKEN_KEY,
}

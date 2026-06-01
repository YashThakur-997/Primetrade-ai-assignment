import { Navigate, Route, Routes } from "react-router-dom"
import { useUser } from "@/context/UserContext"
import LogoutPage from "./pages/auth/logout"
import LoginPage from "./pages/auth/login"
import RegisterPage from "./pages/auth/register"
import HomePage from "./pages/main/Home"

function App() {
  const { token } = useUser()

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/home" replace /> : <LoginPage />}
      />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/home"
        element={token ? <HomePage /> : <Navigate to="/" replace />}
      />
      <Route path="/logout" element={<LogoutPage />} />
    </Routes>
  )
}

export default App

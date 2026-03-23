import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AdminAuthContext } from "../context/AdminAuthContext"

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AdminAuthContext)

  if (loading) return <p className="p-6">Loading...</p>

  return admin ? children : <Navigate to="/" />
}

export default ProtectedRoute
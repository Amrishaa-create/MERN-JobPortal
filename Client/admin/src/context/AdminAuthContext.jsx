import { createContext, useState, useEffect } from "react"
import API from "../services/api"

export const AdminAuthContext = createContext()

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      })

      if (res.data.user.role !== "admin") {
        throw new Error("Access denied: Not an admin")
      }

      setAdmin(res.data.user)

    } catch (error) {
      throw error.response?.data?.message || error.message
    }
  }

  const logout = async () => {
    try {
      await API.post("/auth/logout")
    } catch (err) {
      console.log(err)
    }
    setAdmin(null)
  }
  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const res = await API.get("/users/me")

        if (res.data.role === "admin") {
          setAdmin(res.data)
        } else {
          setAdmin(null)
        }

      } catch (err) {
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    }

    loadAdmin()
  }, [])

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}
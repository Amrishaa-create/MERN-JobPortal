import { createContext, useContext, useState, useEffect } from "react"
import API from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {

    const fetchUser = async () => {
      try {

        const res = await API.get('/auth/me')

        setUser(res.data.user)

      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

  }, [])

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password ,role:"recruiter"})
    setUser(res.data.user)
  }

  const signup = async (name, email, password) => {
    const res = await API.post('/auth/signup', {
      name,
      email,
      password,
      role: "recruiter",
      skills: ["hiring"]
    })
    setUser(res.data.user)
  }

  const logout = async () => {
    await API.post('/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading ,signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)
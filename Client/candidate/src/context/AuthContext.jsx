import { createContext, useContext, useState ,useEffect} from "react"
import API from "../services/api"

export const AuthContext = createContext()

export const AuthProvider=({ children })=> {
  const [user, setUser] = useState(null)
  const[loading,setLoading]=useState(true)
  useEffect(()=>{
    const fetchUser=async()=>{
      try{
        const res=await API.get('/auth/me/candidate')
        setUser(res.data.user)
      }catch(error){
        setUser(null)
      }finally{
        setLoading(false)
      }
    }
    fetchUser()
  },[])
  const signup=async(name,email,password)=>{
    const res=await API.post("/auth/signup",{name,email,password,role:"candidate"})
    setUser(res.data.user)
  }
  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password,role:"candidate" })
    setUser(res.data.user)
  }
  const logout = async () => {
  try {
    await API.post("/auth/logout")
  } catch (error) {
    console.error("Logout error:", error.message)
  } finally {
    setUser(null)
    window.location.href = '/login'
  }
}
  if(loading) return null
  return (
    <AuthContext.Provider value={{user,loading,login,signup,logout}}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth=()=>useContext (AuthContext)

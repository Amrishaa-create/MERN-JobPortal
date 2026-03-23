import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AdminAuthContext } from "../context/AdminAuthContext"
import { Eye, EyeOff, Shield, ArrowRight } from "lucide-react"

function Login() {
  const { login } = useContext(AdminAuthContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError("Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4"
    >
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }}
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center mx-auto mb-5">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">HireHub</h1>
          <p className="text-gray-500 text-lg mt-2 font-medium">Admin Control Panel</p>
        </div>
        <div className="bg-[#1a1d27] border border-white/10 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Welcome back</h2>
          <p className="text-gray-500 text-xl mb-8">Sign in to manage your platform</p>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xl font-semibold px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-2xl font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@hirehub.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-5 py-4 rounded-xl text-2xl focus:outline-none focus:border-blue-500 focus:bg-white/8 transition"
              />
            </div>
            <div>
              <label className="text-2xl font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-5 py-4 rounded-xl text-2xl focus:outline-none focus:border-blue-500 transition pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl text-2xl transition-all group mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-600 text-xl mt-6">
          HireHub Admin Panel · Restricted Access
        </p>
      </div>
    </div>
  )
}

export default Login
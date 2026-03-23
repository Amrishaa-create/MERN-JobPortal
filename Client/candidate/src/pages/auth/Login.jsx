import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock, Briefcase, Star, Zap } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
      className="min-h-screen flex bg-slate-50"
    >
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/10 blur-xl" />
        <div className="absolute bottom-32 left-16 w-48 h-48 rounded-full bg-violet-400/20 blur-2xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black text-white">HireHub</span>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-2 rounded-full text-2xl font-bold">
            <Zap size={24} /> Candidate Portal
          </div>
          <h1 className="text-5xl xl:text-7xl font-black text-white leading-none tracking-tight">
            Your next<br />
            <span className="text-indigo-200">dream job</span><br />
            awaits.
          </h1>
          <p className="text-2xl text-indigo-200 leading-relaxed max-w-md">
            Browse thousands of opportunities, track applications, and land your perfect role.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: "50K+", label: "Jobs Listed" },
            { value: "10K+", label: "Companies" },
            { value: "95%", label: "Placed" }
          ].map((s, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-white">{s.value}</p>
              <p className="text-2xl text-indigo-200 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex lg:hidden items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900">HireHub</span>
          </div>
          <div>
            <p className="text-2xl font-black text-indigo-500 uppercase tracking-[0.2em] mb-2">
              Welcome back
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Candidate Login
            </h2>
            <p className="text-2xl text-slate-400 mt-2">
              Sign in to continue your job search
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-2xl font-semibold px-5 py-4 rounded-2xl">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xl font-black text-slate-500 uppercase tracking-wider mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 pl-12 pr-5 py-4 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-medium"
                />
              </div>
            </div>
            <div>
              <label className="text-xl font-black text-slate-500 uppercase tracking-wider mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 pl-12 pr-14 py-4 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-medium"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition">
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-2xl transition-all hover:shadow-xl hover:shadow-indigo-500/25 group mt-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm text-slate-400 font-medium">New to HireHub?</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <Link to="/signup"
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-500 font-black py-4 rounded-2xl text-2xl transition-all">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock, User, CheckCircle, Zap } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const Signup = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [name, setName] = useState("")
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
      await signup(name, email, password)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  const perks = [
    "Browse thousands of job openings",
    "Track all your applications",
    "Get interview notifications",
    "AI-powered job matching"
  ]

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
      className="min-h-screen flex bg-slate-50"
    >
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }}
        />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
          <span className="text-3xl font-black text-white">HireHub</span>
        </div>
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full text-2xl font-bold mb-4">
              <Zap size={24} /> Join as Candidate
            </div>
            <h1 className="text-5xl xl:text-6xl font-black text-white leading-none tracking-tight">
              Start your<br />
              <span className="text-indigo-400">career</span><br />
              journey.
            </h1>
            <p className="text-2xl text-slate-400 leading-relaxed mt-4 max-w-md">
              Create your free account and get discovered by top companies today.
            </p>
          </div>
          <div className="space-y-3">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={24} className="text-indigo-400" />
                </div>
                <span className="text-2xl text-slate-300 font-medium">{perk}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-slate-600 text-xl">
          Free to join. No credit card required.
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex lg:hidden items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <span className="text-3xl font-black text-slate-900">HireHub</span>
          </div>
          <div>
            <p className="text-2xl font-black text-indigo-500 uppercase tracking-[0.2em] mb-2">Get started</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Create Account</h2>
            <p className="text-2xl text-slate-400 mt-2">Free forever · No credit card needed</p>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-2xl font-semibold px-5 py-4 rounded-2xl">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xl font-black text-slate-500 uppercase tracking-wider mb-2 block">Full Name</label>
              <div className="relative">
                <User size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="John Smith" value={name} onChange={e => setName(e.target.value)} required
                  className="w-full bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 pl-12 pr-5 py-4 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-medium"
                />
              </div>
            </div>
            <div>
              <label className="text-xl font-black text-slate-500 uppercase tracking-wider mb-2 block">Email Address</label>
              <div className="relative">
                <Mail size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 pl-12 pr-5 py-4 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-medium"
                />
              </div>
            </div>
            <div>
              <label className="text-xl font-black text-slate-500 uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <Lock size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} required
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
                <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
              ) : (
                <>Create Account <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-2xl text-slate-400 font-medium">Already have an account?</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <Link to="/login"
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-500 font-black py-4 rounded-2xl text-2xl transition-all">
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
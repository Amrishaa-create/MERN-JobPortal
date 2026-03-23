import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff, Briefcase, ArrowRight, Mail, Lock, User, CheckCircle } from "lucide-react"
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
      navigate("/")
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  const perks = [
    "Post unlimited job openings",
    "AI-powered candidate matching",
    "Schedule interviews instantly",
    "Admin-reviewed job approvals"
  ]
  return (
    <div
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      className="min-h-screen flex bg-gray-50"
    >
      <div className="hidden lg:flex w-1/2 bg-gray-900 flex-col justify-between p-16 relative overflow-hidden">

        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center">
              <Briefcase size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white">HireHub</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-blue-400 px-4 py-2 rounded-full text-xl font-bold mb-4">
              Join as Recruiter
            </div>
            <h1 className="text-5xl xl:text-6xl font-black text-white leading-none tracking-tight">
              Start building<br />
              <span className="text-blue-400">your dream</span><br />
              team today.
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed mt-4 max-w-md">
              Everything you need to find, evaluate and hire the best candidates — in one place.
            </p>
          </div>

          <div className="space-y-3">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={14} className="text-blue-400" />
                </div>
                <span className="text-lg text-gray-300 font-medium">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-gray-600 text-lg">
            All recruiter accounts require admin approval before posting jobs.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">

          <div className="flex lg:hidden items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Briefcase size={26} className="text-white" />
            </div>
            <span className="text-3xl font-black text-gray-900">HireHub</span>
          </div>

          <div>
            <p className="text-xl font-bold text-blue-500 uppercase tracking-[0.2em] mb-2">
              Get started
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              Create Account
            </h2>
            <p className="text-xl text-gray-400 mt-2">
              Join HireHub as a recruiter — free forever
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-base font-semibold px-5 py-4 rounded-2xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-2xl font-black text-gray-500 uppercase tracking-wider mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <User size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 pl-12 pr-5 py-4 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="text-2xl font-black text-gray-500 uppercase tracking-wider mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 pl-12 pr-5 py-4 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="text-2xl font-black text-gray-500 uppercase tracking-wider mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 pl-12 pr-14 py-4 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-xl transition-all hover:shadow-xl hover:shadow-blue-500/25 group mt-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-xl text-gray-400 text-center">
              By signing up, your account will need admin approval before posting jobs.
            </p>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-2xl text-gray-400 font-medium">Already a recruiter?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-500 font-black py-4 rounded-2xl text-2xl transition-all"
          >
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Briefcase, ArrowRight, Mail, Lock } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      className="min-h-screen flex bg-gray-50"
    >
      <div className="hidden lg:flex w-1/2 bg-blue-500 flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Briefcase size={26} className="text-white" />
            </div>
            <span className="text-3xl font-black text-white">HireHub</span>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-xl font-bold">
            Recruiter Portal
          </div>
          <h1 className="text-5xl xl:text-7xl font-black text-white leading-none tracking-tight">
            Hire the<br />
            <span className="text-blue-200">best talent</span><br />
            faster.
          </h1>
          <p className="text-2xl text-blue-100 leading-relaxed max-w-md">
            Post jobs, review applications, schedule interviews — all in one powerful recruiter dashboard.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[{ value: "10K+", label: "Active Jobs" }, { value: "50K+", label: "Candidates" }, { value: "98%", label: "Satisfaction" }].map((s, i) => (
            <div key={i} className="bg-white/15 rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-white">{s.value}</p>
              <p className="text-lg text-blue-200 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex lg:hidden items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Briefcase size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900">HireHub</span>
          </div>
          <div>
            <p className="text-xl font-bold text-blue-500 uppercase tracking-[0.2em] mb-2">Welcome back</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">Recruiter Login</h2>
            <p className="text-2xl text-gray-400 mt-2">Sign in to manage your hiring pipeline</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-base font-semibold px-5 py-4 rounded-2xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={Lock}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="xl"
              fullWidth
              loading={loading}
              className="mt-2"
            >
              Sign In <ArrowRight size={24} />
            </Button>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xl text-gray-400 font-medium">New to HireHub?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <Link to="/signup">
            <Button variant="outline" size="xl" fullWidth>
              Create Recruiter Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
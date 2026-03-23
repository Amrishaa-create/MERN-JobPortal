import { useEffect, useState } from "react"
import API from "../../services/api"
import { Briefcase, FileText, Users, Calendar, ArrowRight, TrendingUp, Clock, CheckCircle, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

function AnimatedNumber({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = parseInt(value) || 0
    if (end === 0) return
    const increment = Math.ceil(end / 50)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setDisplay(end); clearInterval(timer) }
      else setDisplay(start)
    }, duration / 50)
    return () => clearInterval(timer)
  }, [value])
  return <span>{display}</span>
}

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    const fetchStats = async () => {
      try {
        const res = await API.get("/recruiter/dashboard/stats")
        setStats({
          jobs: res.data.jobs || 0,
          applications: res.data.applications || 0,
          candidates: res.data.candidates || 0,
          interviews: res.data.interviews || 0
        })
      } catch (error) {
        console.error("Error loading dashboard", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    {
      title: "Active Jobs",
      value: stats?.jobs || 0,
      icon: Briefcase,
      bg: "bg-blue-500",
      light: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
      trend: "Your live postings",
      path: "/jobs"
    },
    {
      title: "Applications",
      value: stats?.applications || 0,
      icon: FileText,
      bg: "bg-violet-500",
      light: "bg-violet-50",
      text: "text-violet-600",
      border: "border-violet-100",
      trend: "Total received",
      path: "/applications"
    },
    {
      title: "Candidates",
      value: stats?.candidates || 0,
      icon: Users,
      bg: "bg-emerald-500",
      light: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      trend: "Unique applicants",
      path: "/applications"
    },
    {
      title: "Interviews",
      value: stats?.interviews || 0,
      icon: Calendar,
      bg: "bg-orange-500",
      light: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-100",
      trend: "Scheduled",
      path: "/interviews"
    }
  ]
  const pipeline = [
    { label: "Applications Received", value: stats?.applications || 0, color: "bg-blue-500" },
    { label: "Candidates Matched",    value: stats?.candidates || 0,   color: "bg-violet-500" },
    { label: "Interviews Scheduled",  value: stats?.interviews || 0,   color: "bg-orange-500" }
  ]
  const quickActions = [
    { label: "Post New Job",         sub: "Add a new job opening",         icon: Plus,     path: "/jobs",         bg: "bg-blue-500" },
    { label: "View Applications",    sub: "Review candidate applications", icon: FileText, path: "/applications", bg: "bg-violet-500" },
    { label: "Scheduled Interviews", sub: "See upcoming interviews",       icon: Calendar, path: "/interviews",   bg: "bg-orange-500" }
  ]

  return (
    <div
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      className="w-full min-h-screen bg-gray-50/80 px-4 md:px-8 py-6 space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold text-blue-500 uppercase tracking-[0.2em] mb-1">
            Recruiter Panel
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-none tracking-tight">
            {greeting}!
          </h1>
          <p className="text-lg text-gray-400 mt-2 font-medium">
            {new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-7 py-4 rounded-2xl font-black text-2xl transition-all hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 group"
        >
          <Plus size={24} />
          Post a Job
          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {loading
          ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-56 rounded-3xl bg-white border border-gray-100 animate-pulse" />
            ))
          : cards.map((card, i) => {
              const Icon = card.icon
              return (
                <div
                  key={i}
                  onClick={() => navigate(card.path)}
                  className={`bg-white border ${card.border} rounded-3xl p-6 md:p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 ${card.light} rounded-2xl flex items-center justify-center mb-5`}>
                    <Icon size={32} className={card.text} />
                  </div>
                  <h2 className="text-6xl md:text-7xl xl:text-8xl font-black text-gray-900 leading-none tracking-tighter">
                    <AnimatedNumber value={card.value} />
                  </h2>
                  <p className="text-lg md:text-2xl font-black text-gray-800 mt-3">
                    {card.title}
                  </p>
                  <p className="text-sm md:text-xl text-gray-400 mt-1 flex items-center gap-1 font-medium">
                    <TrendingUp size={24} /> {card.trend}
                  </p>
                  <div className={`mt-5 h-1.5 rounded-full ${card.light} overflow-hidden`}>
                    <div className={`h-full ${card.bg} rounded-full w-0 group-hover:w-full transition-all duration-700`} />
                  </div>
                </div>
              )
            })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-3xl p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl md:text-4xl font-black text-gray-900">Hiring Pipeline</h3>
              <p className="text-xl text-gray-400 mt-0.5">Live funnel overview</p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-2 rounded-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-2xl font-bold text-green-600">Active</span>
            </div>
          </div>

          <div className="space-y-7">
            {loading
              ? Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-14 rounded-2xl bg-gray-100 animate-pulse" />
                ))
              : pipeline.map((item, i) => {
                  const maxVal = Math.max(...pipeline.map(p => p.value), 1)
                  const width = maxVal > 0 ? (item.value / maxVal) * 100 : 0
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl md:text-2xl font-bold text-gray-700">{item.label}</span>
                        <span className="text-3xl md:text-4xl font-black text-gray-900">{item.value}</span>
                      </div>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
          </div>

          {!loading && stats?.applications > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <span className="text-lg md:text-2xl font-semibold text-gray-500">
                Interview conversion rate
              </span>
              <span className="text-2xl md:text-3xl font-black text-blue-600">
                {((stats.interviews / stats.applications) * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div className="bg-white border border-gray-100 rounded-3xl p-7">
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-1">Quick Actions</h3>
          <p className="text-xl text-gray-400 mb-6">Jump to key tasks</p>
          <div className="space-y-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <button
                  key={i}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-4 p-4 md:p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group text-left"
                >
                  <div className={`w-12 h-12 ${action.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-black text-gray-900">{action.label}</p>
                    <p className="text-xl text-gray-400">{action.sub}</p>
                  </div>
                  <ArrowRight size={24} className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-3xl px-7 py-6 flex flex-wrap gap-6 items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle size={24} className="text-emerald-500" />
          <span className="text-2xl font-bold text-gray-700">Platform running smoothly</span>
        </div>
        <div className="flex flex-wrap gap-8">
          {[
            { label: "Jobs Posted",      value: stats?.jobs || 0,         color: "text-blue-600" },
            { label: "Total Applicants", value: stats?.applications || 0, color: "text-violet-600" },
            { label: "Interviews Set",   value: stats?.interviews || 0,   color: "text-orange-600" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`text-3xl md:text-4xl font-black ${item.color}`}>
                {loading ? "—" : item.value}
              </span>
              <span className="text-base md:text-2xl text-gray-600 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-2xl text-gray-700">
          <Clock size={24} />
          Last updated: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
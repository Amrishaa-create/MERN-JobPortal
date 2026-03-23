import { Users, Briefcase, FileText, Activity, UserCheck, TrendingUp, ArrowRight, Bell, Settings, LayoutDashboard } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    let start = 0
    const end = parseInt(value)
    if (start === end) return
    const duration = 1200
    const step = Math.ceil(duration / end) || 20
    const timer = setInterval(() => {
      start += Math.ceil(end / 60)
      if (start >= end) { setDisplay(end); clearInterval(timer) }
      else setDisplay(start)
    }, step)
    return () => clearInterval(timer)
  }, [value])
  return <span ref={ref}>{display}</span>
}
function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(new Date())
  const navigate = useNavigate()
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats")
        setStats(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
    const tick = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(tick)
  }, [])
  const cards = [
    {
      title: "Total Users",
      value: stats?.users || 0,
      icon: Users,
      accent: "#3b82f6",
      light: "rgba(59,130,246,0.12)",
      tag: "Platform members"
    },
    {
      title: "Active Jobs",
      value: stats?.jobs || 0,
      icon: Briefcase,
      accent: "#10b981",
      light: "rgba(16,185,129,0.12)",
      tag: "Live postings"
    },
    {
      title: "Applications",
      value: stats?.applications || 0,
      icon: FileText,
      accent: "#8b5cf6",
      light: "rgba(139,92,246,0.12)",
      tag: "Submitted"
    },
    {
      title: "Recruiters",
      value: stats?.recruiters || 0,
      icon: Activity,
      accent: "#f59e0b",
      light: "rgba(245,158,11,0.12)",
      tag: "Approved & active"
    },
    {
      title: "Pending Jobs",
      value: stats?.pendingRecruiters || 0,
      icon: UserCheck,
      accent: "#ef4444",
      light: "rgba(239,68,68,0.12)",
      tag: "Need your review"
    }
  ]
  const quickActions = [
    { label: "Manage Users", sub: "View all platform users", path: "/users", icon: Users, color: "#3b82f6" },
    { label: "Review Jobs", sub: "Approve or reject postings", path: "/jobs", icon: Briefcase, color: "#10b981" }
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="w-full min-h-screen bg-[#0f1117] text-white px-4 md:px-8 py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400 uppercase tracking-[0.2em]">HireHub Admin</p>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tight">
              Dashboard
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#1a1d27] border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-2xl font-mono font-bold text-white">
              {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
          <div className="bg-[#1a1d27] border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-2">
            <Bell size={24} className="text-gray-400" />
            {stats?.pendingRecruiters > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-2xl font-black flex items-center justify-center">
                {stats.pendingRecruiters}
              </span>
            )}
          </div>
          <div className="bg-[#1a1d27] border border-white/10 p-2.5 rounded-xl">
            <Settings size={24} className="text-gray-400" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-500 text-2xl font-medium -mt-4">
        <span>{time.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        <span>·</span>
        <span className="text-green-400 font-semibold">All systems operational</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {loading
          ? Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-[#1a1d27] animate-pulse" />
            ))
          : cards.map((card, i) => {
              const Icon = card.icon
              return (
                <div
                  key={i}
                  className="relative bg-[#1a1d27] border border-white/5 rounded-2xl p-6 overflow-hidden group hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  style={{ boxShadow: `0 0 0 0 ${card.accent}` }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{ background: `radial-gradient(circle at top left, ${card.light}, transparent 70%)` }}
                  />
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: card.light }}
                    >
                      <Icon size={24} style={{ color: card.accent }} />
                    </div>
                    <TrendingUp size={24} className="text-gray-600 mt-1" />
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-5xl md:text-6xl font-black text-white leading-none mb-1">
                      <AnimatedNumber value={card.value} />
                    </h2>
                    <p className="text-2xl font-semibold text-gray-300 mt-2">{card.title}</p>
                    <p className="text-xl text-gray-500 mt-1">{card.tag}</p>
                  </div>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, ${card.accent}, transparent)` }}
                  />
                </div>
              )
            })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-6">
          <h3 className="text-3xl font-black text-white mb-1">Quick Actions</h3>
          <p className="text-2xl text-gray-500 mb-5">Jump to key areas</p>
          <div className="space-y-3">
            {quickActions.map((btn, i) => {
              const Icon = btn.icon
              return (
                <button
                  key={i}
                  onClick={() => navigate(btn.path)}
                  className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 px-4 py-4 rounded-xl transition-all duration-200 group text-left"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${btn.color}22` }}
                  >
                    <Icon size={24} style={{ color: btn.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-white">{btn.label}</p>
                    <p className="text-xl text-gray-500">{btn.sub}</p>
                  </div>
                  <ArrowRight size={24} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              )
            })}
          </div>
        </div>
        <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-6">
          <h3 className="text-3xl font-black text-white mb-1">System Status</h3>
          <p className="text-2xl text-gray-500 mb-5">Live infrastructure health</p>
          <div className="space-y-3">
            {[
              { label: "Server", status: "Online", value: 99, color: "#10b981" },
              { label: "Database", status: "Connected", value: 100, color: "#10b981" },
              { label: "API Services", status: "Running", value: 97, color: "#10b981" }
            ].map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-semibold text-gray-300">{item.label}</span>
                  <span className="text-xl font-bold flex items-center gap-1.5" style={{ color: item.color }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: item.color }} />
                    {item.status}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${item.value}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-2xl text-gray-500">Uptime</span>
            <span className="text-2xl font-black text-green-400">99.9%</span>
          </div>
        </div>

        <div className="relative bg-[#1a1d27] border border-white/5 rounded-2xl p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ background: "radial-gradient(circle at bottom right, #ef4444, transparent 70%)" }} />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4">
              <UserCheck size={24} className="text-red-400" />
            </div>
            <h3 className="text-3xl font-black text-white mb-1">Pending Jobs</h3>
            <p className="text-2xl text-gray-500 mb-4">Jobs awaiting your approval</p>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-6xl md:text-7xl font-black text-white leading-none">
                {loading ? "—" : <AnimatedNumber value={stats?.pendingRecruiters || 0} />}
              </span>
              <span className="text-gray-500 text-2xl mb-2">jobs</span>
            </div>
            {(stats?.pendingRecruiters || 0) > 0 ? (
              <button
                onClick={() => navigate("/jobs")}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-black py-3.5 rounded-xl transition-all text-base group"
              >
                Review Now
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="w-full flex items-center justify-center gap-2 bg-green-500/10 text-green-400 font-bold py-3.5 rounded-xl text-2xl border border-green-500/20">
                All caught up!
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-[#1a1d27] border border-white/5 rounded-2xl px-6 py-4 flex flex-wrap gap-6 items-center justify-between">
        <p className="text-2xl font-semibold text-gray-500">Platform Overview</p>
        {[
          { label: "Candidates", value: (stats?.users || 0) - (stats?.recruiters || 0), color: "text-blue-400" },
          { label: "Approved Recruiters", value: stats?.recruiters || 0, color: "text-emerald-400" },
          { label: "Total Applications", value: stats?.applications || 0, color: "text-violet-400" },
          { label: "Total Jobs", value: stats?.jobs || 0, color: "text-amber-400" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`text-2xl font-black ${item.color}`}>
              {loading ? "—" : item.value}
            </span>
            <span className="text-2xl text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
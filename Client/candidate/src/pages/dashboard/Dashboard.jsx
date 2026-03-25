import Layout from "../../components/layout/Layout"
import { Briefcase, CalendarDays, ArrowRight, TrendingUp, Star, Clock, CheckCircle, MapPin } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import API from "../../services/api"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = parseInt(value) || 0
    if (end === 0) return
    const inc = Math.ceil(end / 50)
    const timer = setInterval(() => {
      start += inc
      if (start >= end) { setDisplay(end); clearInterval(timer) }
      else setDisplay(start)
    }, 1000 / 50)
    return () => clearInterval(timer)
  }, [value])
  return <span>{display}</span>
}
function Dashboard() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState({ applications: 0, interviews: 0 })
  const [recentApplications, setRecentApplications] = useState([])
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState("")
  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening")
    const fetchDashboard = async () => {
      try {
        const res = await API.get(
          "/candidate/dashboard",
          { withCredentials: true }
        )
        setStats(res.data.stats || { applications: 0, interviews: 0 })
        setRecentApplications(res.data.recentApplications || [])
        setRecommendedJobs(res.data.recommendedJobs || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])
  const statusConfig = {
    Shortlisted: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
    Rejected:    { text: "text-red-600",     bg: "bg-red-50",     border: "border-red-200" },
    Pending:     { text: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200" }
  }
  const quickActions = [
    { label: "Browse Jobs",     sub: "Find new opportunities",    path: "/jobs",         icon: Briefcase,   color: "bg-indigo-500" },
    { label: "My Applications", sub: "Track your progress",       path: "/applications", icon: TrendingUp,  color: "bg-sky-500" },
    { label: "Interviews",      sub: "See your schedule",         path: "/interviews",   icon: CalendarDays,color: "bg-violet-500" },
  ]

  return (
    <Layout>
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
        className="px-4 md:px-8 py-6 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">
              Candidate Portal
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tight">
              {greeting}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
            </h1>
            <p className="text-2xl text-slate-400 mt-2 font-medium">
              {new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center gap-3 bg-indigo-500 hover:bg-indigo-600 text-white px-7 py-4 rounded-2xl font-black text-2xl transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 group self-start md:self-auto"
          >
            <Briefcase size={24} />
            Find Jobs
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { title: "Applications", value: stats.applications, icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50", light: "bg-indigo-500", trend: "Total applied", path: "/applications" },
            { title: "Interviews",   value: stats.interviews,   icon: CalendarDays, color: "text-violet-600", bg: "bg-violet-50", light: "bg-violet-500", trend: "Scheduled", path: "/interviews" }
          ].map((card, i) => {
            const Icon = card.icon
            return (
              <div key={i} onClick={() => navigate(card.path)}
                className="bg-white border border-slate-100 rounded-3xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center mb-5`}>
                  <Icon size={26} className={card.color} />
                </div>
                <h2 className="text-6xl md:text-7xl font-black text-slate-900 leading-none">
                  {loading ? "—" : <AnimatedNumber value={card.value} />}
                </h2>
                <p className="text-xl font-black text-slate-700 mt-2">{card.title}</p>
                <p className="text-2xl text-slate-400 mt-1 flex items-center gap-1">
                  <TrendingUp size={24} /> {card.trend}
                </p>
                <div className={`mt-5 h-1.5 rounded-full ${card.bg} overflow-hidden`}>
                  <div className={`h-full ${card.light} rounded-full w-0 group-hover:w-full transition-all duration-700`} />
                </div>
              </div>
            )
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-black text-slate-900">Recent Applications</h3>
                <p className="text-2xl text-slate-400 mt-0.5">Your latest job applications</p>
              </div>
              <button onClick={() => navigate("/applications")}
                className="text-indigo-500 hover:text-indigo-700 font-black text-2xl flex items-center gap-1 transition">
                View all <ArrowRight size={24} />
              </button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />)}
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-2xl font-black text-slate-300">No applications yet</p>
                <button onClick={() => navigate("/jobs")}
                  className="mt-3 text-indigo-500 font-bold text-2xl hover:underline">
                  Browse jobs
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.slice(0, 4).map((app, i) => {
                  const sc = statusConfig[app.status] || statusConfig.Pending
                  return (
                    <div key={app._id || i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition">
                      <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-black flex-shrink-0">
                        {(app.job?.company || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl font-black text-slate-900 truncate">{app.job?.title || "Job"}</p>
                        <p className="text-2xl text-slate-400 truncate">{app.job?.company || "Company"}</p>
                      </div>
                      <span className={`text-2xl font-black px-3 py-1.5 rounded-xl border flex-shrink-0 ${sc.bg} ${sc.text} ${sc.border}`}>
                        {app.status || "Pending"}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-black text-slate-900">Recommended Jobs</h3>
                <p className="text-2xl text-slate-400 mt-0.5">Matched to your skills</p>
              </div>
              <button onClick={() => navigate("/jobs")}
                className="text-indigo-500 hover:text-indigo-700 font-black text-2xl flex items-center gap-1 transition">
                See all <ArrowRight size={24} />
              </button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />)}
              </div>
            ) : recommendedJobs.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-2xl font-black text-slate-300">No recommendations yet</p>
                <button onClick={() => navigate("/profile")}
                  className="mt-3 text-indigo-500 font-bold text-2xl hover:underline">
                  Update your profile
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendedJobs.slice(0, 4).map((job, i) => (
                  <div key={job._id || i}
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 hover:border-indigo-100 border border-transparent transition cursor-pointer group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <Briefcase size={24} className="text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-2xl font-black text-slate-900 truncate">{job.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-2xl text-slate-400 truncate">{job.company}</span>
                        {job.location && (
                          <span className="text-2xl text-slate-400 flex items-center gap-1 flex-shrink-0">
                            <MapPin size={24} /> {job.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight size={24} className="text-slate-300 group-hover:text-indigo-500 transition flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-7">
          <h3 className="text-3xl font-black text-slate-900 mb-1">Quick Actions</h3>
          <p className="text-2xl text-slate-400 mb-6">Jump to key areas</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <button key={i} onClick={() => navigate(action.path)}
                  className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group text-left"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">{action.label}</p>
                    <p className="text-xl text-slate-400">{action.sub}</p>
                  </div>
                  <ArrowRight size={24} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all ml-auto" />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
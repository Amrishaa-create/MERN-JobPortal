import { useEffect, useState } from "react"
import { FileText, Mail, Briefcase, Star, User, TrendingUp } from "lucide-react"
import API from "../services/api"

const Applications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/recruiter/matches/applications")
        setApplications(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])
  const filtered = applications.filter(app =>
    app.candidate?.name?.toLowerCase().includes(search.toLowerCase()) ||
    app.job?.title?.toLowerCase().includes(search.toLowerCase())
  )
  const statusConfig = {
    Shortlisted: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/20" },
    Applied:     { bg: "bg-blue-500/15",    text: "text-blue-400",    border: "border-blue-500/20" },
    Rejected:    { bg: "bg-red-500/15",     text: "text-red-400",     border: "border-red-500/20" }
  }
  const avatarColors = [
    "from-blue-500 to-cyan-400",
    "from-violet-500 to-purple-400",
    "from-emerald-500 to-teal-400",
    "from-orange-500 to-amber-400",
    "from-pink-500 to-rose-400"
  ]
  const ScoreBar = ({ score }) => {
    const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444"
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xl font-bold text-gray-500 uppercase tracking-wider">Match Score</span>
          <span className="text-2xl font-black" style={{ color }}>{score}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${score}%`, background: color }}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="w-full min-h-screen bg-[#0f1117] text-white px-4 md:px-8 py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-2xl font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">Admin Panel</p>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
            Applications
          </h1>
          <p className="text-gray-500 text-2xl mt-2">{applications.length} total applications</p>
        </div>
        <div className="flex items-center gap-3 bg-[#1a1d27] border border-white/10 px-5 py-3 rounded-2xl">
          <TrendingUp size={24} className="text-emerald-400" />
          <span className="text-2xl font-bold text-white">{filtered.length} results</span>
        </div>
      </div>
      <div className="relative max-w-lg">
        <User size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search by candidate or job title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#1a1d27] border border-white/10 text-white placeholder-gray-600 pl-12 pr-5 py-4 rounded-2xl text-2xl focus:outline-none focus:border-blue-500 transition"
        />
      </div>
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-[#1a1d27] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-28">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-gray-600" />
          </div>
          <p className="text-2xl font-black text-gray-600">No applications found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((app, i) => {
            const sc = statusConfig[app.status] || statusConfig.Applied
            return (
              <div
                key={app._id}
                className="bg-[#1a1d27] border border-white/5 rounded-2xl p-6 hover:border-white/15 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-2xl font-black flex-shrink-0`}>
                      {app.candidate?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white leading-tight">{app.candidate?.name || "Unknown"}</p>
                      <p className="text-xl text-gray-500 mt-0.5">Candidate</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xl font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                    {app.status || "Applied"}
                  </span>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Mail size={24} className="text-gray-600 flex-shrink-0" />
                    <span className="text-2xl text-gray-400 truncate">{app.candidate?.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Briefcase size={24} className="text-gray-600 flex-shrink-0" />
                    <span className="text-2xl text-gray-400">
                      {app.job?.title}
                      {app.job?.company && <span className="text-gray-600"> · {app.job.company}</span>}
                    </span>
                  </div>
                  {app.candidate?.skills?.length > 0 && (
                    <div className="flex items-start gap-2.5">
                      <Star size={24} className="text-gray-600 flex-shrink-0 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {app.candidate.skills.slice(0, 3).map((s, j) => (
                          <span key={j} className="text-xl bg-white/5 text-gray-400 border border-white/5 px-2 py-0.5 rounded-lg font-medium">
                            {s}
                          </span>
                        ))}
                        {app.candidate.skills.length > 3 && (
                          <span className="text-2xl text-gray-600">+{app.candidate.skills.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {app.matchScore !== undefined && <ScoreBar score={app.matchScore} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Applications
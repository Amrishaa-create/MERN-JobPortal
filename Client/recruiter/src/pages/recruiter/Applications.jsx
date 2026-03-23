import { useEffect, useState } from "react"
import API from "../../services/api"
import {
  FileText, Mail, Briefcase, Star, TrendingUp,
  Calendar, Search, CheckCircle, Clock, XCircle, X,
  Video, MapPin, StickyNote
} from "lucide-react"

const Applications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const [scheduling, setScheduling] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ date: "", mode: "Online", location: "", notes: "" })

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await API.get("/recruiter/matches/applications")
        setApplications(data)
      } catch (error) {
        console.error("Error fetching applications:", error)
        setApplications([])
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])
  const openModal = (app) => {
    setSelectedApp(app)
    setForm({ date: "", mode: "Online", location: "", notes: "" })
    setSuccess(false)
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setSelectedApp(null)
    setSuccess(false)
  }
  const handleSchedule = async (e) => {
    e.preventDefault()
    setScheduling(true)
    try {
      await API.post("/interviews/schedule-interview", {
        candidate: selectedApp.candidate?._id,
        job: selectedApp.job?._id,
        date: form.date,
        type: form.mode,
        location: form.location,
        notes: form.notes
      })
      setSuccess(true)
    } catch (err) {
      console.error(err)
      alert("Failed to schedule interview")
    } finally {
      setScheduling(false)
    }
  }
  const filtered = applications.filter(app => {
    const name = app.candidateName || app.candidate?.name || ""
    const title = app.jobTitle || app.job?.title || ""
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      title.toLowerCase().includes(search.toLowerCase())
    const stage = app.status || app.stage || "Applied"
    const matchFilter =
      filter === "all" ||
      stage.toLowerCase() === filter.toLowerCase()
    return matchSearch && matchFilter
  })
  const counts = {
    all:         applications.length,
    applied:     applications.filter(a => (a.status || a.stage || "Applied") === "Applied").length,
    shortlisted: applications.filter(a => (a.status || a.stage) === "Shortlisted").length,
    rejected:    applications.filter(a => (a.status || a.stage) === "Rejected").length,
  }
  const stageConfig = {
    Applied:     { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    icon: <Clock size={13} /> },
    Shortlisted: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: <CheckCircle size={13} /> },
    Rejected:    { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     icon: <XCircle size={13} /> },
    Scheduled:   { bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-200",  icon: <Calendar size={13} /> },
    Pending:     { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  icon: <Clock size={13} /> }
  }
  const avatarColors = [
    "from-blue-500 to-cyan-400",
    "from-violet-500 to-purple-400",
    "from-emerald-500 to-teal-400",
    "from-orange-500 to-amber-400",
    "from-pink-500 to-rose-400",
    "from-indigo-500 to-blue-400"
  ]
  const accentColors = [
    "border-l-blue-400",
    "border-l-violet-400",
    "border-l-emerald-400",
    "border-l-orange-400",
    "border-l-pink-400",
    "border-l-indigo-400"
  ]
  const StageBadge = ({ label }) => {
    const c = stageConfig[label] || stageConfig.Applied
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xl font-bold border ${c.bg} ${c.text} ${c.border}`}>
        {c.icon} {label || "Applied"}
      </span>
    )
  }
  const ScoreBar = ({ score }) => {
    const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444"
    const label = score >= 75 ? "Strong" : score >= 50 ? "Good" : "Weak"
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xl font-black text-gray-400 uppercase tracking-wider">Match Score</span>
          <span className="text-xl font-black flex items-center gap-1" style={{ color }}>
            {score}% <span className="text-xl font-bold opacity-70">· {label}</span>
          </span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${score}%`, background: color }}
          />
        </div>
      </div>
    )
  }
  const SkillsSection = ({ app }) => {
    const candidateSkills = (app.candidate?.skills || []).map(s => s.toLowerCase().trim())
    const jobSkillsRaw = app.job?.requiredSkills || []
    const jobSkills = jobSkillsRaw.map(s => s.toLowerCase().trim())
    if (jobSkills.length === 0) {
      const allSkills = app.candidate?.skills || []
      if (allSkills.length === 0) return null
      return (
        <div className="flex items-start gap-2.5">
          <Star size={15} className="text-gray-400 flex-shrink-0 mt-1" />
          <div className="flex flex-wrap gap-1.5">
            {allSkills.slice(0, 4).map((s, j) => (
              <span key={j} className="text-xl font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-xl">
                {s}
              </span>
            ))}
            {allSkills.length > 4 && (
              <span className="text-xl text-gray-400 self-center">+{allSkills.length - 4}</span>
            )}
          </div>
        </div>
      )
    }
    const matched   = jobSkillsRaw.filter(s => candidateSkills.includes(s.toLowerCase().trim()))
    const unmatched = jobSkillsRaw.filter(s => !candidateSkills.includes(s.toLowerCase().trim()))

    return (
      <div className="flex items-start gap-2.5">
        <Star size={22} className="text-gray-400 flex-shrink-0 mt-1" />
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap gap-1.5">
            {matched.slice(0, 3).map((s, j) => (
              <span key={`m-${j}`}
                className="text-xl font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1"
              >
                <CheckCircle size={18} /> {s}
              </span>
            ))}
            {unmatched.slice(0, 2).map((s, j) => (
              <span key={`u-${j}`}
                className="text-xl font-bold bg-red-50 text-red-400 border border-red-100 px-2.5 py-1 rounded-xl flex items-center gap-1"
              >
                <X size={18} /> {s}
              </span>
            ))}
            {(matched.length + unmatched.length) > 5 && (
              <span className="text-xl text-gray-400 self-center font-medium">
                +{(matched.length + unmatched.length) - 5} more
              </span>
            )}
          </div>
          <p className="text-xl font-bold" style={{
            color: matched.length === jobSkills.length ? "#10b981"
              : matched.length >= jobSkills.length * 0.6 ? "#f59e0b"
              : "#ef4444"
          }}>
            {matched.length}/{jobSkills.length} required skills matched
          </p>
        </div>
      </div>
    )
  }
  const filterTabs = [
    { key: "all",         label: "All" },
    { key: "applied",     label: "Applied" },
    { key: "shortlisted", label: "Shortlisted" },
    { key: "rejected",    label: "Rejected" },
  ]
  return (
    <div
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      className="w-full min-h-screen bg-gray-50/80 px-4 md:px-8 py-6 space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <p className="text-2xl font-semibold text-blue-500 uppercase tracking-[0.2em] mb-1">
            Recruiter Panel
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-none tracking-tight">
            Applications
          </h1>
          <p className="text-2xl text-gray-400 mt-2 font-medium">
            {applications.length} total · {counts.shortlisted} shortlisted · {counts.applied} pending review
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-sm self-start md:self-auto">
          <FileText size={22} className="text-blue-500" />
          <span className="text-2xl font-black text-gray-800">{filtered.length} shown</span>
        </div>
      </div>
      {!loading && applications.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total",       value: counts.all,         color: "text-blue-600",    bg: "bg-blue-50",    icon: <FileText size={24} className="text-blue-500" /> },
            { label: "Applied",     value: counts.applied,     color: "text-blue-600",    bg: "bg-blue-50",    icon: <Clock size={24} className="text-blue-500" /> },
            { label: "Shortlisted", value: counts.shortlisted, color: "text-emerald-600", bg: "bg-emerald-50", icon: <CheckCircle size={24} className="text-emerald-500" /> },
            { label: "Rejected",    value: counts.rejected,    color: "text-red-600",     bg: "bg-red-50",     icon: <XCircle size={24} className="text-red-500" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className={`text-3xl md:text-4xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-2xl text-gray-400 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by candidate name or job title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 pl-14 pr-6 py-4 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-5 py-4 rounded-2xl text-sm font-black transition flex items-center gap-2 ${
                filter === tab.key
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span className={`text-2xl px-2 py-0.5 rounded-full font-black ${
                filter === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {counts[tab.key] ?? filtered.length}
              </span>
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-80 rounded-3xl bg-white border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-28">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
            <FileText size={36} className="text-blue-400" />
          </div>
          <p className="text-3xl font-black text-gray-300">
            {search ? "No applications match" : "No applications yet"}
          </p>
          <p className="text-gray-400 text-lg mt-2">
            {search ? "Try different keywords" : "Candidate applications will appear here"}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((app, i) => (
            <div
              key={app._id}
              className={`bg-white border border-gray-100 border-l-4 ${accentColors[i % accentColors.length]} rounded-3xl p-7 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div>
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-3xl font-black flex-shrink-0`}>
                      {(app.candidateName || app.candidate?.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl md:text-3xl font-black text-gray-900 leading-tight">
                        {app.candidateName || app.candidate?.name || "Unknown"}
                      </h2>
                      <p className="text-xl text-gray-400 mt-0.5">Candidate</p>
                    </div>
                  </div>
                  <StageBadge label={app.status || app.stage || "Applied"} />
                </div>
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center gap-2.5">
                    <Mail size={22} className="text-gray-400 flex-shrink-0" />
                    <span className="text-2xl text-gray-500 truncate">
                      {app.candidate?.email || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Briefcase size={22} className="text-gray-400 flex-shrink-0" />
                    <span className="text-base md:text-3xl font-semibold text-gray-700">
                      {app.jobTitle || app.job?.title || "Unknown Role"}
                    </span>
                  </div>
                  <SkillsSection app={app} />
                </div>
                {app.matchScore !== undefined && <ScoreBar score={app.matchScore} />}

                <div className="mt-4">
                  {app.candidate?.resume ? (
                    <a
                      href={`http://localhost:4500/${app.candidate.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2.5 rounded-xl text-2xl font-bold hover:bg-blue-500 hover:text-white hover:border-blue-500 transition"
                    >
                      <FileText size={22} /> View Resume
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400 flex items-center gap-1.5">
                      <FileText size={22} /> No resume uploaded
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => openModal(app)}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 py-3.5 rounded-2xl transition font-black text-2xl"
              >
                <Calendar size={24} /> Schedule Interview
              </button>
            </div>
          ))}
        </div>
      )}
      {modalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100"
          >
            {success ? (
              <div className="p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Interview Scheduled!</h2>
                <p className="text-gray-500 text-2xl mb-2">
                  Interview with <span className="text-gray-900 font-black">
                    {selectedApp.candidateName || selectedApp.candidate?.name}
                  </span> has been confirmed.
                </p>
                <p className="text-gray-400 text-2xl mb-8">The candidate will be notified.</p>
                <button
                  onClick={closeModal}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl text-xl transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between p-7 pb-5 border-b border-gray-100">
                  <div>
                    <p className="text-2xl font-black text-blue-500 uppercase tracking-widest mb-1">Schedule</p>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900">Interview Details</h2>
                    <p className="text-gray-400 text-xl mt-1">
                      For <span className="text-gray-900 font-black">
                        {selectedApp.candidateName || selectedApp.candidate?.name}
                      </span>
                      <span className="text-gray-400"> · {selectedApp.jobTitle || selectedApp.job?.title}</span>
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition flex-shrink-0"
                  >
                    <X size={28} />
                  </button>
                </div>

                <form onSubmit={handleSchedule} className="p-7 space-y-5">
                  <div>
                    <label className="text-xl font-black text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Clock size={24} /> Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-5 py-3.5 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition [color-scheme:light]"
                    />
                  </div>

                  <div>
                    <label className="text-xl font-black text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Video size={24} /> Interview Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Online", "Onsite"].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setForm({ ...form, mode: m })}
                          className={`py-3.5 rounded-2xl font-black text-2xl transition flex items-center justify-center gap-2 border ${
                            form.mode === m
                              ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20"
                              : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {m === "Online" ? <Video size={22} /> : <MapPin size={22} />}
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.mode === "Onsite" && (
                    <div>
                      <label className="text-xl font-black text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin size={22} /> Venue / Address
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3rd Floor, Tech Park, Chennai"
                        required
                        value={form.location}
                        onChange={e => setForm({ ...form, location: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 px-5 py-3.5 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xl font-black text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <StickyNote size={24} /> Notes
                      <span className="text-gray-400 normal-case font-normal">(optional)</span>
                    </label>
                    <textarea
                      placeholder="e.g. Please join 5 mins early. Bring your portfolio..."
                      value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      rows={3}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 px-5 py-3.5 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={scheduling}
                    className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-2xl transition"
                  >
                    {scheduling ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <><Calendar size={24} /> Confirm Schedule</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Applications
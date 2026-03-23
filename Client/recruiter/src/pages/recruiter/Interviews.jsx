import { useEffect, useState } from "react"
import API from "../../services/api"
import { Calendar, Video, MapPin, Clock, CheckCircle, XCircle, StickyNote } from "lucide-react"
import Badge from "../../components/ui/Badge"
import Input from "../../components/ui/Input"
import { Search } from "lucide-react"

const Interviews = () => {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await API.get("/interviews/recruiter")
        setInterviews(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error("ERROR:", err)
        setInterviews([])
      } finally {
        setLoading(false)
      }
    }
    fetchInterviews()
  }, [])

  const filtered = interviews.filter(i => {
    const matchSearch =
      i.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.candidate?.name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === "all" ||
      (filter === "online" && (i.type === "Online" || i.mode === "Online")) ||
      (filter === "onsite" && (i.type === "Onsite" || i.mode === "Onsite")) ||
      (filter === "scheduled" && (i.status === "Scheduled" || !i.status)) ||
      (filter === "completed" && i.status === "Completed") ||
      (filter === "cancelled" && i.status === "Cancelled")
    return matchSearch && matchFilter
  })

  const counts = {
    all: interviews.length,
    scheduled: interviews.filter(i => !i.status || i.status === "Scheduled").length,
    completed: interviews.filter(i => i.status === "Completed").length,
    online: interviews.filter(i => i.type === "Online" || i.mode === "Online").length,
    onsite: interviews.filter(i => i.type === "Onsite" || i.mode === "Onsite").length,
  }
  const accentColors = [
    "border-l-blue-400", "border-l-violet-400", "border-l-emerald-400",
    "border-l-orange-400", "border-l-pink-400", "border-l-indigo-400"
  ]
  const avatarColors = [
    "from-blue-500 to-cyan-400", "from-violet-500 to-purple-400",
    "from-emerald-500 to-teal-400", "from-orange-500 to-amber-400",
    "from-pink-500 to-rose-400", "from-indigo-500 to-blue-400"
  ]

  const isUpcoming = (date) => date && new Date(date) > new Date()

  const filterTabs = [
    { key: "all", label: "All" }, { key: "scheduled", label: "Scheduled" },
    { key: "completed", label: "Completed" }, { key: "online", label: "Online" },
    { key: "onsite", label: "Onsite" }
  ]

  return (
    <div
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      className="w-full min-h-screen bg-gray-50/80 px-4 md:px-8 py-6 space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <p className="text-2xl font-semibold text-blue-500 uppercase tracking-[0.2em] mb-1">Recruiter Panel</p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-none tracking-tight">Interviews</h1>
          <p className="text-2xl text-gray-400 mt-2 font-medium">
            {interviews.length} total · {counts.scheduled} scheduled · {counts.completed} completed
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-sm self-start md:self-auto">
          <Calendar size={24} className="text-blue-500" />
          <span className="text-2xl font-black text-gray-800">{filtered.length} shown</span>
        </div>
      </div>
      {!loading && interviews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: counts.all, color: "text-blue-600", bg: "bg-blue-50", icon: <Calendar size={20} className="text-blue-500" /> },
            { label: "Scheduled", value: counts.scheduled, color: "text-blue-600", bg: "bg-blue-50", icon: <Clock size={20} className="text-blue-500" /> },
            { label: "Completed", value: counts.completed, color: "text-emerald-600", bg: "bg-emerald-50", icon: <CheckCircle size={20} className="text-emerald-500" /> },
            { label: "Online", value: counts.online, color: "text-violet-600", bg: "bg-violet-50", icon: <Video size={20} className="text-violet-500" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>{stat.icon}</div>
              <div>
                <p className={`text-3xl md:text-4xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-2xl text-gray-400 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by job title or candidate name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterTabs.map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={`px-5 py-4 rounded-2xl text-sm font-black transition flex items-center gap-2 ${
                filter === tab.key ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span className={`text-2xl px-2 py-0.5 rounded-full font-black ${filter === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {counts[tab.key] ?? filtered.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <div key={i} className="h-72 rounded-3xl bg-white border border-gray-100 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-28">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
            <Calendar size={36} className="text-blue-400" />
          </div>
          <p className="text-3xl font-black text-gray-300">{search ? "No interviews match your search" : "No interviews scheduled yet"}</p>
          <p className="text-gray-400 text-2xl mt-2">{search ? "Try different keywords" : "Schedule interviews from the Applications page"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((interview, i) => {
            const mode = interview.type || interview.mode || "Online"
            const status = interview.status || "Scheduled"
            const upcoming = isUpcoming(interview.date)
            return (
              <div key={interview._id}
                className={`bg-white border border-gray-100 border-l-4 ${accentColors[i % accentColors.length]} rounded-3xl p-7 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Calendar size={26} className="text-blue-500" />
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge label={status} size="xl" />
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4">
                    {interview.job?.title || "Job Position"}
                  </h2>

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-lg font-black flex-shrink-0`}>
                      {interview.candidate?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-lg md:text-2xl font-black text-gray-800">{interview.candidate?.name || "Unknown"}</p>
                      <p className="text-xl text-gray-400">Candidate</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                      <Clock size={22} className="text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-xl font-bold text-gray-400 uppercase tracking-wider">Date & Time</p>
                        <p className="text-base md:text-2xl font-black text-gray-800">
                          {interview.date ? new Date(interview.date).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Not set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                      {mode === "Online" ? <Video size={24} className="text-violet-500 flex-shrink-0" /> : <MapPin size={24} className="text-orange-500 flex-shrink-0" />}
                      <div>
                        <p className="text-xl font-bold text-gray-400 uppercase tracking-wider">Mode</p>
                        <p className="text-base md:text-2xl font-black text-gray-800">{mode}</p>
                      </div>
                    </div>
                    {interview.location && (
                      <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                        <MapPin size={18} className="text-orange-500 flex-shrink-0" />
                        <div>
                          <p className="text-xl font-bold text-gray-400 uppercase tracking-wider">Venue</p>
                          <p className="text-base md:text-2xl font-black text-gray-800">{interview.location}</p>
                        </div>
                      </div>
                    )}
                    {interview.notes && (
                      <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-100 rounded-2xl px-4 py-3">
                        <StickyNote size={24} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xl font-bold text-yellow-600 uppercase tracking-wider">Notes</p>
                          <p className="text-2xl text-gray-700 mt-0.5">{interview.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                  <Badge label={mode === "Online" ? "Interview" : "Scheduled"} size="xl" />
                  <p className="text-2xl text-gray-400 font-medium">{interview.round || "Technical"} Round</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Interviews
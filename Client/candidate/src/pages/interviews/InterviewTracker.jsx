import { useEffect, useState } from "react"
import Layout from "../../components/layout/Layout"
import axios from "axios"
import {Calendar, Clock, CheckCircle, XCircle,Video, MapPin, StickyNote, Briefcase, Building2} from "lucide-react"

const statusConfig = {
  Scheduled: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    icon: <Clock size={14} />,       dot: "bg-blue-500" },
  Completed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: <CheckCircle size={14} />, dot: "bg-emerald-500" },
  Cancelled: { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     icon: <XCircle size={14} />,     dot: "bg-red-500" }
}
const accentColors = [
  "border-l-indigo-400", "border-l-sky-400", "border-l-emerald-400",
  "border-l-violet-400", "border-l-pink-400", "border-l-amber-400"
]
const avatarColors = [
  "from-indigo-500 to-violet-500", "from-sky-500 to-blue-500",
  "from-emerald-500 to-teal-500", "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500", "from-purple-500 to-indigo-500"
]
function InterviewTracker() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetchInterviews() }, [])
  const fetchInterviews = async () => {
    try {
      const res = await axios.get(
        "/interviews/my",
        { withCredentials: true }
      )
      setInterviews(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const isUpcoming = (date) => date && new Date(date) > new Date()
  const counts = {
    total: interviews.length,
    scheduled: interviews.filter(i => i.status === "Scheduled" || !i.status).length,
    completed: interviews.filter(i => i.status === "Completed").length,
    upcoming: interviews.filter(i => isUpcoming(i.date)).length
  }

  return (
    <Layout>
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
        className="px-4 md:px-8 py-6 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">
              Candidate Portal
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tight">
              My Interviews
            </h1>
            <p className="text-2xl text-slate-400 mt-2 font-medium">
              {interviews.length} total · {counts.upcoming} upcoming · {counts.completed} completed
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm self-start md:self-auto">
            <Calendar size={24} className="text-indigo-500" />
            <span className="text-2xl font-black text-slate-800">{interviews.length} scheduled</span>
          </div>
        </div>
        {!loading && interviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total",     value: counts.total,     color: "text-indigo-600",  bg: "bg-indigo-50",  icon: <Calendar size={20} className="text-indigo-500" /> },
              { label: "Scheduled", value: counts.scheduled, color: "text-blue-600",    bg: "bg-blue-50",    icon: <Clock size={20} className="text-blue-500" /> },
              { label: "Upcoming",  value: counts.upcoming,  color: "text-violet-600",  bg: "bg-violet-50",  icon: <Calendar size={20} className="text-violet-500" /> },
              { label: "Completed", value: counts.completed, color: "text-emerald-600", bg: "bg-emerald-50", icon: <CheckCircle size={20} className="text-emerald-500" /> }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {stat.icon}
                </div>
                <div>
                  <p className={`text-3xl md:text-4xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-2xl text-slate-400 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-white border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-28">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
              <Calendar size={36} className="text-indigo-400" />
            </div>
            <p className="text-3xl font-black text-slate-300">No interviews yet</p>
            <p className="text-slate-400 text-2xl mt-2">
              Interviews scheduled by recruiters will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {interviews.map((interview, i) => {
              const status = interview.status || "Scheduled"
              const sc = statusConfig[status] || statusConfig.Scheduled
              const mode = interview.type || interview.mode || "Online"
              const upcoming = isUpcoming(interview.date)

              return (
                <div key={interview._id}
                  className={`bg-white border border-slate-100 border-l-4 ${accentColors[i % accentColors.length]} rounded-3xl p-7 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-2xl font-black flex-shrink-0`}>
                        {(interview.job?.company || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-2xl font-black border ${sc.bg} ${sc.text} ${sc.border}`}>
                          {sc.icon} {status}
                        </span>
                        {upcoming && (
                          <span className="text-2xl font-black text-violet-600 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-lg">
                            Upcoming
                          </span>
                        )}
                      </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-1">
                      {interview.job?.title || "Job Position"}
                    </h2>
                    <div className="flex items-center gap-2 mb-5">
                      <Building2 size={24} className="text-slate-400" />
                      <p className="text-2xl font-semibold text-slate-500">
                        {interview.job?.company || "Company"}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3">
                        <Clock size={18} className="text-indigo-400 flex-shrink-0" />
                        <div>
                          <p className="text-xl font-black text-slate-400 uppercase tracking-wider">Date & Time</p>
                          <p className="text-lg md:text-2xl font-black text-slate-800">
                            {interview.date
                              ? new Date(interview.date).toLocaleString([], {
                                  weekday: "short", month: "short", day: "numeric",
                                  hour: "2-digit", minute: "2-digit"
                                })
                              : "Not set"}
                          </p>
                        </div>
                      </div>
                       <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3">
                        {mode === "Online"
                          ? <Video size={24} className="text-violet-400 flex-shrink-0" />
                          : <MapPin size={24} className="text-amber-400 flex-shrink-0" />
                        }
                        <div>
                          <p className="text-xl font-black text-slate-400 uppercase tracking-wider">Mode</p>
                          <p className="text-base md:text-2xl font-black text-slate-800">{mode}</p>
                        </div>
                      </div>
                      {interview.location && (
                        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3">
                          <MapPin size={24} className="text-amber-400 flex-shrink-0" />
                          <div>
                            <p className="text-xl font-black text-slate-400 uppercase tracking-wider">Venue</p>
                            <p className="text-base md:text-2xl font-black text-slate-800">{interview.location}</p>
                          </div>
                        </div>
                      )}
                      {interview.notes && (
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                          <StickyNote size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xl font-black text-amber-600 uppercase tracking-wider">Notes</p>
                            <p className="text-2xl text-slate-700 mt-0.5">{interview.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${sc.dot} animate-pulse`} />
                      <span className="text-2xl font-bold text-slate-400">{interview.round || "Technical"} Round</span>
                    </div>
                    {mode === "Online" && (
                      <span className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-600 border border-violet-100 px-3 py-1.5 rounded-xl text-2xl font-bold">
                        <Video size={24} /> Online
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default InterviewTracker
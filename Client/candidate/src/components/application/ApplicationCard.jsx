import { CalendarDays, Briefcase, Building2, ArrowRight, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

const statusConfig = {
  Shortlisted: {
    bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200",
    icon: <CheckCircle size={24} />, dot: "bg-emerald-500", bar: "bg-emerald-500"
  },
  Rejected: {
    bg: "bg-red-50", text: "text-red-700", border: "border-red-200",
    icon: <XCircle size={24} />, dot: "bg-red-500", bar: "bg-red-500"
  },
  Pending: {
    bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200",
    icon: <Clock size={24} />, dot: "bg-amber-500", bar: "bg-amber-400"
  },
  Applied: {
    bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200",
    icon: <Clock size={24} />, dot: "bg-blue-500", bar: "bg-blue-400"
  },
  Interview: {
    bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200",
    icon: <CalendarDays size={24} />, dot: "bg-violet-500", bar: "bg-violet-500"
  }
}
const accentColors = [
  "border-l-indigo-400",
  "border-l-sky-400",
  "border-l-emerald-400",
  "border-l-violet-400",
  "border-l-pink-400",
  "border-l-amber-400"
]
const avatarColors = [
  "from-indigo-500 to-violet-500",
  "from-sky-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500",
  "from-purple-500 to-indigo-500"
]
function ApplicationCard({ application, index = 0 }) {
  const status = application.status || "Applied"
  const sc = statusConfig[status] || statusConfig.Applied
  const accent = accentColors[index % accentColors.length]
  const avatar = avatarColors[index % avatarColors.length]

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
      className={`
        bg-white border border-slate-100 border-l-4 ${accent}
        rounded-3xl p-7 flex flex-col justify-between
        hover:shadow-2xl hover:-translate-y-1
        transition-all duration-300 group
      `}
    >
      <div>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatar} flex items-center justify-center text-white text-2xl font-black flex-shrink-0`}>
            {(application.company || application.job?.company || "?").charAt(0).toUpperCase()}
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-2xl font-black border ${sc.bg} ${sc.text} ${sc.border}`}>
            {sc.icon}
            {status}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-1">
          {application.role || application.job?.title || "Job Position"}
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={16} className="text-slate-400 flex-shrink-0" />
          <p className="text-lg md:text-2xl font-semibold text-slate-500">
            {application.company || application.job?.company || "Company"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl">
            <CalendarDays size={24} className="text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xl font-black text-slate-400 uppercase tracking-wider leading-none mb-0.5">Applied</p>
              <p className="text-2xl font-black text-slate-700">
                {application.date
                  ? new Date(application.date).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
                  : application.date || "—"}
              </p>
            </div>
          </div>
          {application.matchScore !== undefined && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl">
              <TrendingUp size={24} className="text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-xl font-black text-slate-400 uppercase tracking-wider leading-none mb-0.5">Match</p>
                <p className={`text-2xl font-black ${
                  application.matchScore >= 75 ? "text-emerald-600" :
                  application.matchScore >= 50 ? "text-amber-600" : "text-red-500"
                }`}>
                  {application.matchScore}%
                </p>
              </div>
            </div>
          )}
          {(application.type || application.job?.type) && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl">
              <Briefcase size={24} className="text-slate-400 flex-shrink-0" />
              <p className="text-2xl font-black text-slate-700">
                {application.type || application.job?.type}
              </p>
            </div>
          )}
        </div>
        {application.matchScore !== undefined && (
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xl font-black text-slate-400 uppercase tracking-wider">Profile match</span>
              <span className={`text-2xl font-black ${
                application.matchScore >= 75 ? "text-emerald-600" :
                application.matchScore >= 50 ? "text-amber-600" : "text-red-500"
              }`}>
                {application.matchScore >= 75 ? "Strong" : application.matchScore >= 50 ? "Good" : "Weak"}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${sc.bar} rounded-full transition-all duration-1000`}
                style={{ width: `${application.matchScore}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${sc.dot} animate-pulse`} />
          <span className="text-2xl font-bold text-slate-500">
            {status === "Shortlisted" ? "Under review" :
             status === "Rejected"    ? "Not selected" :
             status === "Interview"   ? "Interview set" :
             "In progress"}
          </span>
        </div>
        {(application.jobId || application.job?._id) && (
          <Link
            to={`/jobs/${application.jobId || application.job?._id}`}
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-2xl text-2xl font-black transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 group-hover:gap-3"
          >
            View Job
            <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  )
}

export default ApplicationCard
import { MapPin, Briefcase, BadgeDollarSign, ArrowRight, Clock, Star } from "lucide-react"
import { Link } from "react-router-dom"

const accentColors = [
  { border: "border-l-indigo-400", icon: "bg-indigo-50", iconText: "text-indigo-500", btn: "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/25" },
  { border: "border-l-sky-400",    icon: "bg-sky-50",    iconText: "text-sky-500",    btn: "bg-sky-500 hover:bg-sky-600 shadow-sky-500/25" },
  { border: "border-l-emerald-400",icon: "bg-emerald-50",iconText: "text-emerald-500",btn: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25" },
  { border: "border-l-violet-400", icon: "bg-violet-50", iconText: "text-violet-500", btn: "bg-violet-500 hover:bg-violet-600 shadow-violet-500/25" },
  { border: "border-l-pink-400",   icon: "bg-pink-50",   iconText: "text-pink-500",   btn: "bg-pink-500 hover:bg-pink-600 shadow-pink-500/25" },
  { border: "border-l-amber-400",  icon: "bg-amber-50",  iconText: "text-amber-500",  btn: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25" },
]
function JobCard({ job, index = 0 }) {
  const c = accentColors[index % accentColors.length]
  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
      className={`
        bg-white border border-slate-100 border-l-4 ${c.border}
        rounded-3xl p-7 flex flex-col justify-between
        hover:shadow-2xl hover:-translate-y-1
        transition-all duration-300 group
      `}
    >
      <div>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className={`w-14 h-14 rounded-2xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
            <Briefcase size={26} className={c.iconText} />
          </div>
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-2xl font-bold px-3 py-1.5 rounded-xl">
            <Clock size={24} />
            {job.postedAt || "Recently"}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-1">
          {job.title}
        </h2>
        <p className="text-2xl md:text-3xl font-semibold text-slate-500 mb-4">
          {job.company}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {job.location && (
            <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-2xl font-bold px-3 py-1.5 rounded-xl">
              <MapPin size={24} className="text-slate-400" />
              {job.location}
            </span>
          )}
          {job.type && (
            <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-2xl font-bold px-3 py-1.5 rounded-xl">
              <Briefcase size={24} className="text-slate-400" />
              {job.type}
            </span>
          )}
          {job.salary && (
            <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-2xl font-bold px-3 py-1.5 rounded-xl">
              <BadgeDollarSign size={24} className="text-slate-400" />
              {typeof job.salary === "number" ? `₹${job.salary.toLocaleString()}` : job.salary}
            </span>
          )}
        </div>
        {job.requiredSkills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {job.requiredSkills.slice(0, 3).map((skill, i) => (
              <span key={i} className="text-2xl font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-xl">
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 3 && (
              <span className="text-2xl text-slate-400 font-medium self-center">
                +{job.requiredSkills.length - 3} more
              </span>
            )}
          </div>
        )}
        {job.description && (
          <p className="text-2xl text-slate-400 leading-relaxed line-clamp-2 mt-3">
            {job.description}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
        {job.matchScore !== undefined ? (
          <div className="flex items-center gap-1.5">
            <Star size={15} className="text-amber-400" />
            <span className="text-2xl font-black text-slate-700">{job.matchScore}% match</span>
          </div>
        ) : (
          <span className="text-2xl text-slate-400 font-medium">
            {job.applicants ? `${job.applicants} applicants` : "Apply now"}
          </span>
        )}
        <Link
          to={`/jobs/${job._id || job.id}`}
          className={`
            inline-flex items-center gap-2
            ${c.btn} text-white
            px-5 py-3 rounded-2xl
            text-2xl font-black
            transition-all duration-200
            hover:shadow-xl hover:-translate-y-0.5
            group-hover:gap-3
          `}
        >
          View Details
          <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

export default JobCard
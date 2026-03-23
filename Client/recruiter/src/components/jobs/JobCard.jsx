import { Trash2, Pencil, MapPin, BadgeDollarSign, CheckCircle, Clock, XCircle } from "lucide-react"

const statusStyles = {
  approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: <CheckCircle size={22} /> },
  pending:  { bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-200",  icon: <Clock size={22} /> },
  rejected: { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     icon: <XCircle size={22} /> }
}
const JobCard = ({ job, onDelete, onEdit }) => {
  const ac = statusStyles[job.approvalStatus] || statusStyles.pending

  return (
    <div
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-black text-blue-500">
              {job.title?.charAt(0)?.toUpperCase() || "J"}
            </span>
          </div>
          {job.approvalStatus && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xl font-black border ${ac.bg} ${ac.text} ${ac.border}`}>
              {ac.icon} {job.approvalStatus}
            </span>
          )}
        </div>
        <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mb-1">
          {job.title}
        </h3>
        <p className="text-base font-semibold text-gray-500 mb-3">{job.company}</p>
        <div className="space-y-2">
          {job.location && (
            <div className="flex items-center gap-2">
              <MapPin size={24} className="text-gray-400 flex-shrink-0" />
              <span className="text-xl text-gray-500 font-medium">{job.location}</span>
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-2">
              <BadgeDollarSign size={24} className="text-gray-400 flex-shrink-0" />
              <span className="text-xl text-gray-500 font-medium">
                {Number(job.salary).toLocaleString()}
              </span>
            </div>
          )}
        </div>
        {job.description && (
          <p className="text-xl text-gray-400 mt-3 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xl font-bold ${
          job.status === "Open"
            ? "bg-blue-50 text-blue-600"
            : "bg-gray-100 text-gray-500"
        }`}>
          <span className={`w-2 h-2 rounded-full ${job.status === "Open" ? "bg-blue-500" : "bg-gray-400"}`} />
          {job.status || "Open"}
        </span>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(job)}
              className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition"
              title="Edit"
            >
              <Pencil size={24} />
            </button>
          )}
          <button
            onClick={() => onDelete(job._id)}
            className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition"
            title="Delete"
          >
            <Trash2 size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default JobCard
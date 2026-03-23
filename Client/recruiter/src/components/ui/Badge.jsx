import { CheckCircle, Clock, XCircle, Star, Trophy, User } from "lucide-react"

const badgeConfig = {
  Applied:   { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    icon: <Clock size={22} /> },
  Interview: { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200",  icon: <Star size={22} /> },
  Offer:     { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: <Trophy size={22} /> },
  Rejected:  { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     icon: <XCircle size={22} /> },
  Hired:     { bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-200",  icon: <CheckCircle size={22} /> },
  Scheduled: { bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-200",  icon: <Clock size={22} /> },
  Pending:   { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  icon: <Clock size={22} /> },
  default:   { bg: "bg-gray-100",   text: "text-gray-600",    border: "border-gray-200",    icon: <User size={22} /> }
}

const Badge = ({ label, size = "md" }) => {
  const c = badgeConfig[label] || badgeConfig.default
  const sizes = {
    sm: "px-2.5 py-1 text-xs gap-1",
    md: "px-3.5 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-xl gap-2"
  }

  return (
    <span
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      className={`inline-flex items-center font-bold rounded-xl border ${c.bg} ${c.text} ${c.border} ${sizes[size] || sizes.md}`}
    >
      {c.icon}
      {label}
    </span>
  )
}

export default Badge
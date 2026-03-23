const variants = {
  default: "bg-white border border-gray-100 shadow-sm hover:shadow-lg",
  flat:    "bg-gray-50 border border-gray-100",
  accent:  "bg-white border border-gray-100 border-l-4 border-l-blue-400 shadow-sm hover:shadow-lg",
  ghost:   "bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm",
  colored: "bg-blue-50 border border-blue-100"
}
const paddings = {
  none: "",
  sm:   "p-4",
  md:   "p-6 md:p-7",
  lg:   "p-7 md:p-9",
  xl:   "p-9 md:p-11"
}
const Card = ({
  children,
  variant = "default",
  padding = "xl",
  hover = true,
  className = "",
  onClick
}) => {
  return (
    <div
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      onClick={onClick}
      className={`
        rounded-3xl transition-all duration-300
        ${variants[variant] || variants.default}
        ${paddings[padding] || paddings.md}
        ${hover ? "hover:-translate-y-0.5" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card
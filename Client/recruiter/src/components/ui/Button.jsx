const variants = {
  primary:   "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/25",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  danger:    "bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500",
  success:   "bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-500",
  outline:   "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500",
  ghost:     "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900"
}

const sizes = {
  sm:  "px-4 py-2.5 text-sm rounded-xl",
  md:  "px-6 py-3.5 text-base rounded-2xl",
  lg:  "px-8 py-4 text-lg rounded-2xl",
  xl:  "px-10 py-5 text-2xl rounded-2xl"
}

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  type = "button"
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      className={`
        inline-flex items-center justify-center gap-2.5
        font-black tracking-tight
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:-translate-y-0.5 active:translate-y-0
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          Loading...
        </>
      ) : children}
    </button>
  )
}

export default Button
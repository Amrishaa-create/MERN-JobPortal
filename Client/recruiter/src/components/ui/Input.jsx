import { useState } from "react"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  label,
  icon: Icon,
  error,
  success,
  hint,
  required = false,
  disabled = false,
  className = "",
  name,
  rows = 4,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const isTextarea = type === "textarea"
  const inputType = isPassword ? (showPassword ? "text" : "password") : type

  const borderClass = error
    ? "border-red-300 focus:ring-red-500 focus:border-red-400 bg-red-50"
    : success
    ? "border-emerald-300 focus:ring-emerald-500 focus:border-emerald-400 bg-emerald-50"
    : "border-gray-200 focus:ring-blue-500 focus:border-blue-400 bg-gray-50 focus:bg-white"

  const baseClass = `
    w-full border text-gray-900 placeholder-gray-400
    text-xl font-medium rounded-2xl transition-all duration-200
    focus:outline-none focus:ring-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${Icon ? "pl-12" : "pl-5"}
    ${isPassword || error || success ? "pr-12" : "pr-5"}
    ${isTextarea ? "py-4 resize-none" : "py-4"}
    ${borderClass}
    ${className}
  `
  return (
    <div
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      className="w-full space-y-2"
    >
      {label && (
        <label className="text-xl font-black text-gray-500 uppercase tracking-wider flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={24} />
          </div>
        )}

        {isTextarea ? (
          <textarea
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            rows={rows}
            className={baseClass}
            {...props}
          />
        ) : (
          <input
            name={name}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={baseClass}
            {...props}
          />
        )}
        {(isPassword || error || success) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            ) : error ? (
              <AlertCircle size={24} className="text-red-500" />
            ) : success ? (
              <CheckCircle size={24} className="text-emerald-500" />
            ) : null}
          </div>
        )}
      </div>
      {(error || success || hint) && (
        <p className={`text-sm font-semibold flex items-center gap-1.5 ${
          error ? "text-red-500" : success ? "text-emerald-600" : "text-gray-400"
        }`}>
          {error ? <AlertCircle size={13} /> : success ? <CheckCircle size={22} /> : null}
          {error || success || hint}
        </p>
      )}
    </div>
  )
}

export default Input
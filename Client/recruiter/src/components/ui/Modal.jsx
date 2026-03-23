import { useEffect } from "react"
import { X } from "lucide-react"

const sizes = {
  sm:   "max-w-md",
  md:   "max-w-lg",
  lg:   "max-w-2xl",
  xl:   "max-w-4xl",
  full: "max-w-6xl"
}

const Modal = ({
  open,
  onClose,
  children,
  title,
  subtitle,
  size = "md",
  footer,
  hideClose = false
}) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose() }
    if (open) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [open])
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
        onClick={e => e.stopPropagation()}
        className={`
          relative w-full ${sizes[size] || sizes.md}
          max-h-[90vh] flex flex-col
          bg-white rounded-3xl shadow-2xl border border-gray-100
          transform transition-all duration-300
        `}
      >
        {(title || !hideClose) && (
          <div className="flex items-start justify-between px-7 py-6 border-b border-gray-100 flex-shrink-0">
            {title && (
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xl text-gray-400 mt-1 font-medium">{subtitle}</p>
                )}
              </div>
            )}
            {!hideClose && (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition flex-shrink-0 ml-4"
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-7 py-6">
          {children}
        </div>

        {footer && (
          <div className="px-7 py-5 border-t border-gray-100 flex-shrink-0 flex flex-col sm:flex-row gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
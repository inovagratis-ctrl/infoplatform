import Link from "next/link"

interface LogoProps {
  showText?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "light" | "dark"
}

export function Logo({ showText = true, size = "md", variant = "dark" }: LogoProps) {
  const sizes = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-12 w-12" }
  const textSizes = { sm: "text-lg", md: "text-xl", lg: "text-2xl" }

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className={`${sizes[size]} relative`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="10" fill="url(#logoGrad)" />
          <circle cx="20" cy="20" r="8" stroke="#FCD34D" strokeWidth="2" fill="none" />
          <circle cx="20" cy="20" r="3" fill="#FCD34D" />
          <circle cx="14" cy="14" r="1.5" fill="white" opacity="0.6" />
          <circle cx="26" cy="14" r="1.5" fill="white" opacity="0.6" />
          <circle cx="14" cy="26" r="1.5" fill="white" opacity="0.6" />
          <circle cx="26" cy="26" r="1.5" fill="white" opacity="0.6" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-bold leading-tight ${variant === "light" ? "text-white" : "text-gray-900"}`}>
            Núcleo <span className="text-amber-500">VIP</span>
          </span>
        </div>
      )}
    </Link>
  )
}

export function LogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="logoGradIcon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#logoGradIcon)" />
      <circle cx="20" cy="20" r="8" stroke="#FCD34D" strokeWidth="2" fill="none" />
      <circle cx="20" cy="20" r="3" fill="#FCD34D" />
      <circle cx="14" cy="14" r="1.5" fill="white" opacity="0.6" />
      <circle cx="26" cy="14" r="1.5" fill="white" opacity="0.6" />
      <circle cx="14" cy="26" r="1.5" fill="white" opacity="0.6" />
      <circle cx="26" cy="26" r="1.5" fill="white" opacity="0.6" />
    </svg>
  )
}

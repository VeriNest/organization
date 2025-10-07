export function  CustomCard({ children, className = "", variant = "white" }) {
  const baseStyles = "rounded-lg shadow-sm"
  const variantStyles = {
    white: "bg-white border border-slate-200",
    dark: "bg-slate-800 text-white",
  }

  return <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</div>
}

export function CustomCardContent({ children, className = "p-6" }) {
  return <div className={className}>{children}</div>
}

export default function CustomButton({
  variant = "primary",
  children,
  className = "",
  ...props
}) {
  const baseStyles =
    "px-6 py-2 rounded-full font-medium transition-colors duration-200 flex items-center gap-2";

  const variantStyles = {
    primary: "bg-slate-800 hover:bg-slate-700 text-white",
    outline:
      "border border-slate-800 text-slate-800 hover:bg-slate-50 bg-transparent",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

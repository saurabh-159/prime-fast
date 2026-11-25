export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const styles = {
    primary: 'bg-[#4D9E18] text-white hover:bg-[#3D8212]',
    outline: 'border border-[#E4E4E7] bg-white text-[#18181B] hover:bg-[#F8FAFC]',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-[#52525B] hover:bg-[#F8FAFC] hover:text-[#18181B]',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

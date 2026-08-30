export function Logo({
  className,
  variant = 'full',
}: {
  className?: string
  variant?: 'full' | 'compact'
}) {
  return (
    <a
      href="#top"
      className={`flex items-center gap-2 font-display text-lg font-semibold tracking-tight ${className ?? ''}`}
    >
      <img src="/favicon-white.svg" alt="" className="h-6 w-6" />
      {variant === 'compact' ? (
        <span>Kaede</span>
      ) : (
        <span className="flex items-baseline gap-1.5">
          <span>Kaede</span>
          <span>Project</span>
        </span>
      )}
    </a>
  )
}

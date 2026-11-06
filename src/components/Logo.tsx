export function Logo({
  className,
  variant = 'full',
  href = '#top',
}: {
  className?: string
  variant?: 'full' | 'compact'
  href?: string
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2 font-display text-base font-semibold tracking-tight sm:text-lg ${className ?? ''}`}
    >
      <img src="/favicon-white.svg" alt="" width={24} height={24} className="h-6 w-6" />
      {variant === 'compact' ? (
        <span>Kaede</span>
      ) : (
        <span className="flex items-baseline gap-1.5">
          <span className="font-bold">Kaede</span>
          <span className="font-normal">Project</span>
        </span>
      )}
    </a>
  )
}

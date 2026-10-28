/** macOS-style window controls: close, minimise, zoom. Size via `className` (e.g. `h-2.5 w-2.5`). */
const COLORS = ['bg-window-close', 'bg-window-minimize', 'bg-window-zoom']

export function WindowDots({ className = 'h-2.5 w-2.5', gap = 'gap-1.5' }: { className?: string; gap?: string }) {
  return (
    <div className={`flex ${gap}`} aria-hidden="true">
      {COLORS.map((color) => (
        <span key={color} className={`rounded-full ${color} ${className}`} />
      ))}
    </div>
  )
}

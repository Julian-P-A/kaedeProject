import { useReducedMotion } from '#/hooks/useReducedMotion'
import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const INTERACTIVE = 'a[href], button, [role="button"], [role="link"], summary, label[for]'
const NATIVE_CURSOR = 'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], :disabled, [aria-disabled="true"]'
const FOLLOW = { stiffness: 420, damping: 35, mass: 0.55 }

export function BrandCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, FOLLOW)
  const smoothY = useSpring(pointerY, FOLLOW)
  // A small lean follows the horizontal movement and settles as the cursor catches up.
  const lean = useTransform(() => Math.max(-10, Math.min(10, (pointerX.get() - smoothX.get()) * 0.18)))
  const rotation = useSpring(lean, { stiffness: 180, damping: 24 })

  useEffect(() => {
    const cursor = ref.current
    if (!cursor) return

    const root = document.documentElement
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let frame = 0
    let x = 0
    let y = 0
    let visible = false

    const hide = () => {
      cancelAnimationFrame(frame)
      frame = 0
      visible = false
      cursor.style.opacity = '0'
      root.classList.remove('has-brand-cursor')
    }

    const updateTarget = (target: Element | null) => {
      if (!target || target.closest(NATIVE_CURSOR)) {
        hide()
        return false
      }
      cursor.dataset.hover = String(!!target.closest(INTERACTIVE))
      return true
    }

    const move = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== 'mouse') {
        hide()
        return
      }
      if (!updateTarget(event.target instanceof Element ? event.target : null)) return

      x = event.clientX
      y = event.clientY
      pointerX.set(x)
      pointerY.set(y)
      if (!visible) {
        smoothX.jump(x)
        smoothY.jump(y)
        rotation.jump(0)
      }
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        cursor.style.opacity = '1'
        visible = true
        // Hide the native cursor only once the replacement has a valid position.
        root.classList.add('has-brand-cursor')
      })
    }

    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) hide()
    }
    const scroll = () => {
      if (visible) updateTarget(document.elementFromPoint(x, y))
    }
    const visibility = () => {
      if (document.hidden) hide()
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', move, { passive: true })
    window.addEventListener('pointerout', leave)
    window.addEventListener('blur', hide)
    document.addEventListener('scroll', scroll, { passive: true, capture: true })
    document.addEventListener('visibilitychange', visibility)
    finePointer.addEventListener('change', hide)

    return () => {
      hide()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', move)
      window.removeEventListener('pointerout', leave)
      window.removeEventListener('blur', hide)
      document.removeEventListener('scroll', scroll, true)
      document.removeEventListener('visibilitychange', visibility)
      finePointer.removeEventListener('change', hide)
    }
  }, [pointerX, pointerY, smoothX, smoothY, rotation])

  return (
    <motion.div
      ref={ref}
      className="brand-cursor"
      aria-hidden="true"
      style={{ x: reduce ? pointerX : smoothX, y: reduce ? pointerY : smoothY, rotate: reduce ? 0 : rotation }}
    >
      <svg className="brand-cursor-shape" viewBox="100 16 214 368" fill="white" focusable="false">
        {/* The central petal from the original Kaede logo. */}
        <path
          d="M207 26C201.643 59.3679 174.858 126.104 110.575 126.104C142.716 148.934 207 230.422 207 373.729C207 230.422 271.284 148.934 303.425 126.104C239.142 126.104 212.357 59.3679 207 26Z"
          stroke="black"
          strokeWidth="0.75"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </motion.div>
  )
}

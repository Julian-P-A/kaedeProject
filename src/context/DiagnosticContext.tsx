import { createContext, lazy, Suspense, useContext, useRef, useState, type ReactNode } from 'react'
import { useHydrated } from '#/hooks/useHydrated'

const Diagnostic = lazy(() => import('#/components/Diagnostic').then(module => ({ default: module.Diagnostic })))

interface DiagnosticContextValue {
  openDiagnostic: () => void
  ready: boolean
}

const DiagnosticContext = createContext<DiagnosticContextValue | null>(null)

export function DiagnosticProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const ready = useHydrated()

  return (
    <DiagnosticContext.Provider
      value={{
        ready,
        openDiagnostic: () => {
          returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
          setHasOpened(true)
          setOpen(true)
        },
      }}
    >
      {children}
      {hasOpened && (
        <Suspense fallback={null}>
          <Diagnostic open={open} onClose={() => setOpen(false)} returnFocusRef={returnFocusRef} />
        </Suspense>
      )}
    </DiagnosticContext.Provider>
  )
}

export function useDiagnostic() {
  const ctx = useContext(DiagnosticContext)
  if (!ctx) throw new Error('useDiagnostic must be used within a DiagnosticProvider')
  return ctx
}

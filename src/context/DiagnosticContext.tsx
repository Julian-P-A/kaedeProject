import { createContext, useContext, useRef, useState, type ReactNode } from 'react'
import { Diagnostic } from '#/components/Diagnostic'
import { useHydrated } from '#/hooks/useHydrated'

interface DiagnosticContextValue {
  openDiagnostic: () => void
  ready: boolean
}

const DiagnosticContext = createContext<DiagnosticContextValue | null>(null)

export function DiagnosticProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const ready = useHydrated()

  return (
    <DiagnosticContext.Provider
      value={{
        ready,
        openDiagnostic: () => {
          returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
          setOpen(true)
        },
      }}
    >
      {children}
      <Diagnostic open={open} onClose={() => setOpen(false)} returnFocusRef={returnFocusRef} />
    </DiagnosticContext.Provider>
  )
}

export function useDiagnostic() {
  const ctx = useContext(DiagnosticContext)
  if (!ctx) throw new Error('useDiagnostic must be used within a DiagnosticProvider')
  return ctx
}

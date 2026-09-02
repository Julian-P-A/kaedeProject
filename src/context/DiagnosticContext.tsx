import { createContext, useContext, useState, type ReactNode } from 'react'
import { Diagnostic } from '#/components/Diagnostic'

interface DiagnosticContextValue {
  openDiagnostic: () => void
}

const DiagnosticContext = createContext<DiagnosticContextValue | null>(null)

export function DiagnosticProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <DiagnosticContext.Provider value={{ openDiagnostic: () => setOpen(true) }}>
      {children}
      <Diagnostic open={open} onClose={() => setOpen(false)} />
    </DiagnosticContext.Provider>
  )
}

export function useDiagnostic() {
  const ctx = useContext(DiagnosticContext)
  if (!ctx) throw new Error('useDiagnostic must be used within a DiagnosticProvider')
  return ctx
}

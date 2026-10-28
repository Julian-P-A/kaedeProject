import { useReducedMotion } from '#/hooks/useReducedMotion'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { useLanguage } from '#/context/LanguageContext'
import { getDiagnosticResultId, type DiagnosticAnswers } from '#/lib/diagnosticLogic'
import { submitDiagnosticLead } from '#/lib/diagnosticLead'

const easeOut = [0.16, 1, 0.3, 1] as const
const TOTAL_QUESTIONS = 7
const EMPTY_ANSWERS: DiagnosticAnswers = [null, null, null, null, null, null, null]
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+\d][\d\s-]{6,}$/
type Step = number // 0..6 questions, 7 contact, 8 result

// Web3Forms access keys are public client-side configuration, not secrets.
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string

export function Diagnostic({
  open,
  onClose,
  returnFocusRef,
}: {
  open: boolean
  onClose: () => void
  returnFocusRef: RefObject<HTMLElement | null>
}) {
  const { t } = useLanguage()
  const [step, setStep] = useState<Step>(0)
  const [answers, setAnswers] = useState<DiagnosticAnswers>(EMPTY_ANSWERS)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [contactError, setContactError] = useState(false)

  const [delivery, setDelivery] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const requestRef = useRef<symbol | null>(null)
  const openRef = useRef(open)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    openRef.current = open
    if (!open) requestRef.current = null
  }, [open])

  useEffect(
    () => () => {
      requestRef.current = null
    },
    [],
  )

  function resetDiagnostic() {
    if (openRef.current) return
    setStep(0)
    setAnswers(EMPTY_ANSWERS)
    setEmail('')
    setPhone('')
    setContactError(false)
    setDelivery('idle')
  }

  function handleClose() {
    requestRef.current = null
    onClose()
  }

  async function sendLead() {
    if (requestRef.current) return
    const request = Symbol('diagnostic delivery')
    requestRef.current = request
    setDelivery('submitting')
    const resultId = getDiagnosticResultId(answers)
    try {
      await submitDiagnosticLead(
        {
          resultTitle: t.diagnostic.results[resultId].title,
          answerLabels: t.diagnostic.questions.map((question, index) => {
            const option = answers[index]
            return option === null ? '' : `${question.question} → ${question.options[option]}`
          }),
          email: email.trim(),
          phone: phone.trim(),
        },
        WEB3FORMS_ACCESS_KEY,
      )
      if (requestRef.current === request && openRef.current) setDelivery('success')
    } catch {
      if (requestRef.current === request && openRef.current) setDelivery('error')
    } finally {
      if (requestRef.current === request) requestRef.current = null
    }
  }

  function selectOption(questionIndex: number, optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev] as DiagnosticAnswers
      next[questionIndex] = optionIndex
      return next
    })
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1))
  }

  function goNext() {
    if (step < TOTAL_QUESTIONS) {
      if (answers[step] === null) return
      setStep((current) => current + 1)
      return
    }

    if (step === TOTAL_QUESTIONS) {
      if (!EMAIL_PATTERN.test(email.trim()) || !PHONE_PATTERN.test(phone.trim())) {
        setContactError(true)
        return
      }
      setContactError(false)
      void sendLead()
      setStep(TOTAL_QUESTIONS + 1)
    }
  }

  const resultId = step > TOTAL_QUESTIONS ? getDiagnosticResultId(answers) : null

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose()
      }}
    >
      <Dialog.Portal forceMount>
        <AnimatePresence onExitComplete={resetDiagnostic}>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
            >
              <Dialog.Overlay forceMount asChild>
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              </Dialog.Overlay>
              <Dialog.Content
                forceMount
                asChild
                aria-modal="true"
                onOpenAutoFocus={(event) => {
                  event.preventDefault()
                  titleRef.current?.focus()
                }}
                onCloseAutoFocus={(event) => {
                  event.preventDefault()
                  returnFocusRef.current?.focus({ preventScroll: true })
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: easeOut }}
                  onClick={(event) => event.stopPropagation()}
                  className="relative w-full max-h-[calc(100dvh-2rem)] max-w-lg overflow-y-auto rounded-3xl border border-border bg-surface p-6 sm:p-8"
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label={t.diagnostic.nav.close}
                    className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:bg-white/5 hover:text-foreground"
                  >
                    <span className="relative block h-3.5 w-3.5">
                      <span className="absolute left-0 top-1/2 h-px w-3.5 rotate-45 bg-current" />
                      <span className="absolute left-0 top-1/2 h-px w-3.5 -rotate-45 bg-current" />
                    </span>
                  </button>

                  <Dialog.Title asChild>
                    <p
                      ref={titleRef}
                      tabIndex={-1}
                      className="mb-6 px-10 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted outline-none"
                    >
                      {t.diagnostic.title}
                    </p>
                  </Dialog.Title>
                  <Dialog.Description className="sr-only">{t.pricing.diagnosticPrompt}</Dialog.Description>

                  <AnimatePresence mode="wait">
                    {step < TOTAL_QUESTIONS && (
                      <motion.div
                        key={`question-${step}`}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: reduce ? 0 : 0.3, ease: easeOut }}
                      >
                        <p className="text-xs font-medium text-accent">
                          {t.diagnostic.questionLabel} {step + 1} / {TOTAL_QUESTIONS}
                        </p>
                        <h3 className="mt-2 text-balance font-display text-xl font-semibold tracking-tight sm:text-2xl">
                          {t.diagnostic.questions[step].question}
                        </h3>

                        <div className="mt-6 flex flex-col gap-2.5">
                          {t.diagnostic.questions[step].options.map((option, optionIndex) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => selectOption(step, optionIndex)}
                              aria-pressed={answers[step] === optionIndex}
                              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                                answers[step] === optionIndex
                                  ? 'border-accent bg-accent/10 text-foreground'
                                  : 'border-border text-foreground/80 hover:bg-white/5'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {step === TOTAL_QUESTIONS && (
                      <motion.div
                        key="contact"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: reduce ? 0 : 0.3, ease: easeOut }}
                      >
                        <h3 className="text-balance font-display text-xl font-semibold tracking-tight sm:text-2xl">
                          {t.diagnostic.contact.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted">{t.diagnostic.contact.description}</p>

                        <div className="mt-6 flex flex-col gap-4">
                          <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                              {t.diagnostic.contact.emailLabel}
                            </span>
                            <input
                              type="email"
                              value={email}
                              onChange={(event) => setEmail(event.target.value)}
                              placeholder={t.diagnostic.contact.emailPlaceholder}
                              className="rounded-2xl border border-border bg-black/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent"
                            />
                          </label>
                          <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                              {t.diagnostic.contact.phoneLabel}
                            </span>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(event) => setPhone(event.target.value)}
                              placeholder={t.diagnostic.contact.phonePlaceholder}
                              className="rounded-2xl border border-border bg-black/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent"
                            />
                          </label>
                          {contactError && <p className="text-sm text-accent">{t.diagnostic.contact.error}</p>}
                        </div>
                      </motion.div>
                    )}

                    {resultId && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: reduce ? 0 : 0.3, ease: easeOut }}
                      >
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
                          {t.diagnostic.results[resultId].title}
                        </p>
                        <h3 className="mt-2 text-balance font-display text-xl font-semibold tracking-tight sm:text-2xl">
                          {t.diagnostic.results[resultId].description}
                        </h3>
                        <p className="mt-6 rounded-2xl bg-accent/10 px-4 py-3 text-sm text-foreground">
                          <span role="status" aria-live="polite" aria-atomic="true">
                            {delivery === 'success'
                              ? t.diagnostic.finalMessage
                              : delivery === 'error'
                                ? t.diagnostic.submitError
                                : t.diagnostic.submitting}
                          </span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-8 flex items-center justify-between gap-3">
                    {step > 0 && step <= TOTAL_QUESTIONS ? (
                      <button
                        type="button"
                        onClick={goBack}
                        className="rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-white/5"
                      >
                        {t.diagnostic.nav.back}
                      </button>
                    ) : delivery === 'error' ? (
                      <button
                        type="button"
                        onClick={() => void sendLead()}
                        className="rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-white/5"
                      >
                        {t.diagnostic.retry}
                      </button>
                    ) : (
                      <span />
                    )}

                    {step <= TOTAL_QUESTIONS ? (
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={step < TOTAL_QUESTIONS && answers[step] === null}
                        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {step === TOTAL_QUESTIONS ? t.diagnostic.contact.submit : t.diagnostic.nav.next}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition hover:brightness-95"
                      >
                        {t.diagnostic.nav.close}
                      </button>
                    )}
                  </div>
                </motion.div>
              </Dialog.Content>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export type { DiagnosticAnswers }

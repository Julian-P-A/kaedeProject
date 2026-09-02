import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { getDiagnosticResultId, type DiagnosticAnswers } from '#/lib/diagnosticLogic'

const easeOut = [0.16, 1, 0.3, 1] as const
const TOTAL_QUESTIONS = 7
const EMPTY_ANSWERS: DiagnosticAnswers = [null, null, null, null, null, null, null]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+\d][\d\s-]{6,}$/

type Step = number // 0..6 questions, 7 contact, 8 result

// Public by design (Web3Forms access keys are meant to be embedded client-side).
// Delivery inbox is whatever email is registered against this key on web3forms.com,
// not something this code controls.
const WEB3FORMS_ACCESS_KEY = '***REMOVED-WEB3FORMS-ACCESS-KEY***'

/**
 * Sends the completed diagnosis straight from the browser via Web3Forms — no
 * backend/CRM exists in this project (static site, no API routes), so this
 * posts directly to Web3Forms' public submit endpoint, which forwards it to
 * whichever inbox the access key above is registered to.
 */
async function submitDiagnosticLead(payload: {
  resultTitle: string
  answerLabels: string[]
  email: string
  phone: string
}) {
  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `New diagnostic lead — ${payload.resultTitle}`,
        from_name: 'Kaede Project — Diagnostic',
        email: payload.email,
        phone: payload.phone,
        result: payload.resultTitle,
        ...Object.fromEntries(payload.answerLabels.map((label, i) => [`question_${i + 1}`, label])),
      }),
    })
  } catch (error) {
    console.error('[diagnostic] failed to submit lead', error)
  }
}

export function Diagnostic({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage()
  const [step, setStep] = useState<Step>(0)
  const [answers, setAnswers] = useState<DiagnosticAnswers>(EMPTY_ANSWERS)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [contactError, setContactError] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function handleClose() {
    onClose()
    setTimeout(() => {
      setStep(0)
      setAnswers(EMPTY_ANSWERS)
      setEmail('')
      setPhone('')
      setContactError(false)
    }, 300)
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
      const resultId = getDiagnosticResultId(answers)
      const answerLabels = t.diagnostic.questions.map((question, i) => {
        const optionIndex = answers[i]
        return optionIndex === null ? '' : `${question.question} → ${question.options[optionIndex]}`
      })
      submitDiagnosticLead({
        resultTitle: t.diagnostic.results[resultId].title,
        answerLabels,
        email: email.trim(),
        phone: phone.trim(),
      })
      setStep(TOTAL_QUESTIONS + 1)
    }
  }

  const resultId = step > TOTAL_QUESTIONS ? getDiagnosticResultId(answers) : null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: easeOut }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8"
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

            <p className="mb-6 px-10 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {t.diagnostic.title}
            </p>

            <AnimatePresence mode="wait">
              {step < TOTAL_QUESTIONS && (
                <motion.div
                  key={`question-${step}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3, ease: easeOut }}
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
                  transition={{ duration: 0.3, ease: easeOut }}
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
                  transition={{ duration: 0.3, ease: easeOut }}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
                    {t.diagnostic.results[resultId].title}
                  </p>
                  <h3 className="mt-2 text-balance font-display text-xl font-semibold tracking-tight sm:text-2xl">
                    {t.diagnostic.results[resultId].description}
                  </h3>
                  <p className="mt-6 rounded-2xl bg-accent/10 px-4 py-3 text-sm text-foreground">
                    {t.diagnostic.finalMessage}
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export type { DiagnosticAnswers }

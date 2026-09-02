import type { DiagnosticResultId } from '#/data/translations'

/**
 * Answers are option indexes per question, in the same order as
 * `translations.diagnostic.questions` (index 3, the metric question, is
 * informational only and isn't used by any branch below).
 */
export type DiagnosticAnswers = [
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
]

export function getDiagnosticResultId(answers: DiagnosticAnswers): DiagnosticResultId {
  const [purpose, obstacle, brandState, , size, mainAction, businessAge] = answers

  if (purpose === 0 || purpose === 3 || size === 2) return 'ecosystemRobust'
  if (obstacle === 1 && (mainAction === 0 || mainAction === 1)) return 'conversionUrgency'
  if (purpose === 1 && size === 0) return 'leadMachine'
  if (obstacle === 2 && mainAction === 2) return 'perceptionGap'
  if (purpose === 2 && size === 1) return 'authorityPositioning'
  if (obstacle === 3 && mainAction === 3) return 'operationalBottleneck'
  if (purpose === 4 || obstacle === 4 || size === 3 || brandState === 2) return 'exploratory'
  if ((businessAge === 0 || businessAge === 1) && obstacle === 0) return 'strategicLaunch'

  return 'exploratory'
}

export interface DiagnosticLead {
  resultTitle: string
  answerLabels: string[]
  email: string
  phone: string
}

/** Resolve only after Web3Forms acknowledges delivery. */
export async function submitDiagnosticLead(
  payload: DiagnosticLead,
  accessKey: string,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  if (!accessKey) throw new Error('Missing contact form configuration')
  const response = await fetcher('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `New diagnostic lead — ${payload.resultTitle}`,
      from_name: 'Kaede Project — Diagnostic',
      email: payload.email,
      phone: payload.phone,
      result: payload.resultTitle,
      botcheck: false,
      ...Object.fromEntries(payload.answerLabels.map((label, index) => [`question_${index + 1}`, label])),
    }),
  })
  if (!response.ok) throw new Error(`Contact request failed (${response.status})`)
  const result: unknown = await response.json()
  if (!result || typeof result !== 'object' || !('success' in result) || result.success !== true) {
    throw new Error('Contact request was not acknowledged')
  }
}

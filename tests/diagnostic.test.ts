import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getDiagnosticResultId, type DiagnosticAnswers } from '../src/lib/diagnosticLogic.ts'
import { submitDiagnosticLead } from '../src/lib/diagnosticLead.ts'

test('diagnostic keeps branch precedence and the metric question is informational', () => {
  const cases: [DiagnosticAnswers, string][] = [
    [[0, 1, 0, 0, 0, 0, 0], 'ecosystemRobust'],
    [[1, 1, 0, 0, 0, 0, 0], 'conversionUrgency'],
    [[1, 0, 0, 0, 0, 0, 0], 'leadMachine'],
    [[2, 2, 0, 0, 0, 2, 2], 'perceptionGap'],
    [[2, 0, 0, 0, 1, 0, 2], 'authorityPositioning'],
    [[2, 3, 0, 0, 0, 3, 2], 'operationalBottleneck'],
    [[4, 0, 0, 0, 0, 0, 0], 'exploratory'],
    [[2, 0, 0, 0, 0, 0, 0], 'strategicLaunch'],
    [[2, 0, 0, 0, 0, 0, 2], 'exploratory'],
  ]
  for (const [answers, expected] of cases) {
    for (const metric of [0, 1, 2, 3]) {
      answers[3] = metric
      assert.equal(getDiagnosticResultId(answers), expected)
    }
  }
})

const payload = {
  resultTitle: 'Test',
  answerLabels: ['Question → Answer'],
  email: 'test@example.com',
  phone: '+57 300 000 0000',
}
const mockFetch =
  (response: Response): typeof fetch =>
  async () =>
    response

test('delivery requires HTTP success and an explicit acknowledgement', async () => {
  await assert.doesNotReject(submitDiagnosticLead(payload, 'test-key', mockFetch(Response.json({ success: true }))))
  for (const status of [400, 429, 500]) {
    await assert.rejects(
      submitDiagnosticLead(payload, 'test-key', mockFetch(Response.json({ success: true }, { status }))),
    )
  }
  for (const body of [{ success: false }, {}, { success: 'true' }, null]) {
    await assert.rejects(submitDiagnosticLead(payload, 'test-key', mockFetch(Response.json(body))))
  }
  await assert.rejects(submitDiagnosticLead(payload, 'test-key', mockFetch(new Response('invalid json'))))
  await assert.rejects(
    submitDiagnosticLead(payload, 'test-key', async () => {
      throw new TypeError('Network failure')
    }),
  )
  await assert.rejects(
    submitDiagnosticLead(payload, '', async () => {
      assert.fail('must not fetch without configuration')
    }),
  )
})

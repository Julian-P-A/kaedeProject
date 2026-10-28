import assert from 'node:assert/strict'
import { test } from 'node:test'
import { preferredLanguage } from '../src/lib/language.ts'

test('language preference respects quality, exclusions and stable ties', () => {
  for (const [header, expected] of [
    ['es;q=0,en;q=1', 'en'],
    ['en;q=0.2,es;q=0.9', 'es'],
    ['es;q=0.5,en;q=0.5', 'es'],
    ['ES-co,en;q=0.8', 'es'],
    ['fr,es-MX;q=0.7', 'es'],
    ['en;q=0,*;q=0.8', 'es'],
    ['es;q=0,*;q=0.8', 'en'],
    ['es;q=2,en;q=0.5', 'en'],
    ['es;q=.9,en;q=0.2', 'en'],
    ['es;q=0.1234,en;q=0.2', 'en'],
    ['english,es;q=0.9', 'es'],
    ['*', 'en'],
    ['', 'en'],
    ['de,fr', 'en'],
    ['en;q=0,es;q=0,*;q=1', 'en'],
  ])
    assert.equal(preferredLanguage(header), expected, header)
})

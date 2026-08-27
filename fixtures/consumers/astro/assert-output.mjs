import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const html = await readFile(
  new URL('./dist/index.html', import.meta.url),
  'utf8',
)
const steps = html.match(/<cad-step\b[^>]*>[\s\S]*?<\/cad-step>/g)
assert.equal(steps?.length, 2)
assert.match(steps[0], /<div slot="title">\s*<h3>Contract<\/h3>\s*<\/div>/)
assert.match(steps[0], /<span slot="marker">[\s\S]*?A[\s\S]*?<\/span>/)
assert.match(steps[0], /<div slot="meta">[\s\S]*?2 minutes[\s\S]*?<\/div>/)
assert.match(steps[0], /<span slot="status">[\s\S]*?Ready[\s\S]*?<\/span>/)
assert.match(steps[0], /<p>Define the behavior\.<\/p>/)
assert.match(steps[1], /title="Verify"/)
assert.doesNotMatch(steps[1], /slot="(?:title|marker|meta|status)"/)
const breadcrumbs = html.match(/<cad-breadcrumb-item\b[^>]*>/g)
assert.equal(breadcrumbs?.length, 4)
for (const index of [0, 2])
  assert.doesNotMatch(breadcrumbs[index], /\bcurrent(?:=|\s|>)/)
for (const index of [1, 3])
  assert.match(breadcrumbs[index], /\bcurrent(?:=|\s|>)/)
const items = html.match(/<cad-list-item\b[^>]*>/g)
assert.doesNotMatch(items[0], /\bcurrent(?:=|\s|>)/)
assert.match(items[1], /\bcurrent(?:=|\s|>)/)
const lists = html.match(/<cad-list\b[^>]*>[\s\S]*?<\/cad-list>/g)
assert.equal(lists?.length, 2)
assert.match(lists[1], /\bcompact(?:=|\s|>)/)
assert.match(lists[1], /<a slot="action" href="\/notes">Open notes<\/a>/)
assert.match(
  lists[1],
  /<button slot="action" type="button">Save note<\/button>/,
)
assert.doesNotMatch(
  html.match(/<cad-input\b[^>]*>/)?.[0] ?? '',
  /\binvalid(?:=|\s|>)/,
)
assert.doesNotMatch(
  html.match(/<cad-slider\b[^>]*>/)?.[0] ?? '',
  /\brange(?:=|\s|>)/,
)
console.log('Packed Astro named slots and title fallback passed.')

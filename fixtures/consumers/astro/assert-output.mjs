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
console.log('Packed Astro named slots and title fallback passed.')

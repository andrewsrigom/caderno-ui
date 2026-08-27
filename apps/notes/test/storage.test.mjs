import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readNotes, writeNote, STORAGE_KEY } from '../app/storage.ts'

const note = {
  id: 'note-a',
  title: 'A decision',
  body: 'Keep the context.',
  reviewed: false,
}
function storage(raw = null) {
  const values = new Map(raw === null ? [] : [[STORAGE_KEY, raw]])
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
}
test('starts empty and preserves other notes and unrelated keys', () => {
  const store = storage()
  store.setItem('unrelated', 'untouched')
  assert.deepEqual(readNotes(store), [])
  writeNote(store, note, note.id)
  writeNote(store, { ...note, id: 'note-b' }, 'note-b')
  assert.equal(readNotes(store).length, 2)
  writeNote(store, { ...note, title: 'Edited' }, note.id)
  assert.equal(readNotes(store)[0].title, 'Edited')
  writeNote(store, null, note.id)
  assert.equal(readNotes(store)[0].id, 'note-b')
  assert.equal(store.getItem('unrelated'), 'untouched')
})
test('invalid, duplicate and future data are never overwritten', () => {
  for (const raw of [
    'broken',
    '{"version":2,"notes":[]}',
    JSON.stringify({ version: 1, notes: [note, note] }),
  ]) {
    const store = storage(raw)
    assert.throws(() => readNotes(store))
    assert.throws(() => writeNote(store, note, note.id))
    assert.equal(store.getItem(STORAGE_KEY), raw)
  }
})
test('quota failures keep the last successfully stored data', () => {
  const store = storage(JSON.stringify({ version: 1, notes: [note] }))
  const previous = store.getItem(STORAGE_KEY)
  store.setItem = () => {
    throw new Error('Quota exceeded')
  }
  assert.throws(() => writeNote(store, { ...note, title: 'Edited' }, note.id))
  assert.equal(store.getItem(STORAGE_KEY), previous)
})

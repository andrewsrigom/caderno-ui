import assert from 'node:assert/strict'
import { test } from 'node:test'
import { BOARD_KEY, readTasks, updateBoard } from '../app/kanban/storage.ts'

const task = {
  id: 'a',
  title: 'Write a note',
  description: 'Keep the source link.',
  status: 'todo',
}
function storage(raw = null) {
  const values = new Map(raw === null ? [] : [[BOARD_KEY, raw]])
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
}

test('board starts empty without writing or reading notes data', () => {
  const store = storage()
  store.setItem('caderno-ui:notes-example:v1', 'private notes')
  store.setItem('unrelated', 'untouched')
  assert.deepEqual(readTasks(store), [])
  assert.equal(store.getItem(BOARD_KEY), null)
  updateBoard(store, { type: 'create', task })
  assert.equal(store.getItem('caderno-ui:notes-example:v1'), 'private notes')
  assert.equal(store.getItem('unrelated'), 'untouched')
})

test('create, edit, move, undo and remove preserve other tasks', () => {
  const store = storage()
  updateBoard(store, { type: 'create', task })
  updateBoard(store, { type: 'create', task: { ...task, id: 'b' } })
  updateBoard(store, {
    type: 'edit',
    task: { ...task, title: 'Edited', description: 'New context' },
  })
  updateBoard(store, { type: 'move', id: 'a', status: 'doing', from: 'todo' })
  assert.deepEqual(readTasks(store)[0], {
    ...task,
    title: 'Edited',
    description: 'New context',
    status: 'doing',
  })
  updateBoard(store, { type: 'move', id: 'a', status: 'todo', from: 'doing' })
  updateBoard(store, { type: 'remove', id: 'a' })
  assert.deepEqual(readTasks(store), [{ ...task, id: 'b' }])
})

test('an old undo cannot replace a more recent move', () => {
  const store = storage()
  updateBoard(store, { type: 'create', task })
  updateBoard(store, { type: 'move', id: 'a', status: 'doing' })
  updateBoard(store, { type: 'move', id: 'a', status: 'done' })
  assert.throws(() =>
    updateBoard(store, {
      type: 'move',
      id: 'a',
      status: 'todo',
      from: 'doing',
    }),
  )
  assert.equal(readTasks(store)[0].status, 'done')
})

test('stale edits and moves do not recreate a removed task', () => {
  const store = storage()
  updateBoard(store, { type: 'create', task })
  updateBoard(store, { type: 'remove', id: task.id })
  assert.throws(() => updateBoard(store, { type: 'edit', task }))
  assert.throws(() =>
    updateBoard(store, { type: 'move', id: task.id, status: 'doing' }),
  )
  assert.deepEqual(readTasks(store), [])
})

test('example tasks are opt-in and never replace a populated board', () => {
  const store = storage()
  updateBoard(store, { type: 'examples', tasks: [task] })
  assert.throws(() =>
    updateBoard(store, { type: 'examples', tasks: [{ ...task, id: 'b' }] }),
  )
  assert.deepEqual(readTasks(store), [task])
})

test('invalid, duplicate and future stored data remain untouched', () => {
  for (const raw of [
    'not json',
    '{"version":2,"tasks":[]}',
    JSON.stringify({ version: 1, tasks: [task, task] }),
    JSON.stringify({ version: 1, tasks: [{ ...task, status: 'missing' }] }),
    JSON.stringify({ version: 1, tasks: [{ ...task, title: ' ' }] }),
  ]) {
    const store = storage(raw)
    assert.throws(() => readTasks(store))
    assert.throws(() => updateBoard(store, { type: 'create', task }))
    assert.equal(store.getItem(BOARD_KEY), raw)
  }
})

test('new invalid tasks and duplicate IDs are rejected before writing', () => {
  const store = storage()
  updateBoard(store, { type: 'create', task })
  const before = store.getItem(BOARD_KEY)
  assert.throws(() => updateBoard(store, { type: 'create', task }))
  assert.throws(() =>
    updateBoard(store, {
      type: 'create',
      task: { ...task, id: 'b', title: ' ' },
    }),
  )
  assert.equal(store.getItem(BOARD_KEY), before)
})

test('storage failures preserve the last successfully saved board', () => {
  const store = storage()
  updateBoard(store, { type: 'create', task })
  const before = store.getItem(BOARD_KEY)
  store.setItem = () => {
    throw new Error('Quota exceeded')
  }
  assert.throws(() =>
    updateBoard(store, { type: 'move', id: task.id, status: 'doing' }),
  )
  assert.equal(store.getItem(BOARD_KEY), before)
  store.getItem = () => {
    throw new Error('Storage blocked')
  }
  assert.throws(() => readTasks(store))
})

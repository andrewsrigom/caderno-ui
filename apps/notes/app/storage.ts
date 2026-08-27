export type Note = {
  id: string
  title: string
  body: string
  reviewed: boolean
}
export const STORAGE_KEY = 'caderno-ui:notes-example:v1'
type NotesFile = { version: 1; notes: Note[] }

function isNote(value: unknown): value is Note {
  if (!value || typeof value !== 'object') return false
  const note = value as Record<string, unknown>
  return (
    typeof note.id === 'string' &&
    note.id.length > 0 &&
    typeof note.title === 'string' &&
    typeof note.body === 'string' &&
    typeof note.reviewed === 'boolean'
  )
}

export function readNotes(storage: Pick<Storage, 'getItem'>): Note[] {
  const raw = storage.getItem(STORAGE_KEY)
  if (raw === null) return []
  const data: unknown = JSON.parse(raw)
  if (
    !data ||
    typeof data !== 'object' ||
    !('version' in data) ||
    data.version !== 1 ||
    !('notes' in data) ||
    !Array.isArray(data.notes) ||
    !data.notes.every(isNote) ||
    new Set(data.notes.map((note) => note.id)).size !== data.notes.length
  ) {
    throw new Error(
      'Unrecognized notes data. Existing storage has not been changed.',
    )
  }
  return data.notes
}

export function writeNote(
  storage: Storage,
  note: Note | null,
  id: string,
): Note[] {
  // Read again so saving one note does not discard other tabs' notes.
  const current = readNotes(storage)
  const next = current.filter((item) => item.id !== id)
  if (note) next.unshift(note)
  const file: NotesFile = { version: 1, notes: next }
  storage.setItem(STORAGE_KEY, JSON.stringify(file))
  return next
}

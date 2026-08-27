'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { CadAlert } from '@caderno-ui/react/alert'
import { CadButton } from '@caderno-ui/react/button'
import { CadToastHost, toast } from '@caderno-ui/react/toast'
import { readNotes, writeNote, STORAGE_KEY, type Note } from './storage'

type NotesState = {
  notes: Note[]
  ready: boolean
  error: string
  save: (note: Note) => Promise<void>
  remove: (id: string) => Promise<void>
}
const NotesContext = createContext<NotesState | null>(null)
const hostId = 'notes-example-feedback'

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const load = useCallback(() => {
    try {
      setNotes(readNotes(window.localStorage))
      setError('')
      setReady(true)
    } catch {
      // A later read failure must not unmount an editor and discard its draft.
      setError(
        'Saved notes could not be read. Nothing has been overwritten. Check browser storage permissions and try again.',
      )
    }
  }, [])
  useEffect(() => {
    load()
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) load()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      toast.dismiss(undefined, { hostId })
    }
  }, [load])

  async function persist(note: Note | null, id: string) {
    if (!ready) throw new Error('Storage is not ready.')
    const operation = Promise.resolve().then(() => {
      const next = writeNote(window.localStorage, note, id)
      setNotes(next)
    })
    toast.promise(operation, {
      hostId,
      loading: note ? 'Saving note…' : 'Deleting note…',
      success: note ? 'Note saved' : 'Note deleted',
      error:
        'Could not save. Your previous notes and current draft have been kept.',
    })
    return operation
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        ready,
        error,
        save: (note) => persist(note, note.id),
        remove: (id) => persist(null, id),
      }}
    >
      <div className="notes-stack">
        {error && (
          <CadAlert variant="danger" heading="Notes unavailable">
            {error}
            <CadButton slot="action" variant="link" onClick={load}>
              Try again
            </CadButton>
          </CadAlert>
        )}
        <noscript>
          <p>
            JavaScript is needed to read and edit notes stored in this browser.
            No notes are sent to a server.
          </p>
        </noscript>
        {children}
      </div>
      <CadToastHost id={hostId} label="Notes notifications" />
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) throw new Error('NotesProvider is required.')
  return context
}

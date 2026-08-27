'use client'

import Link from 'next/link'
import { CadEmptyState } from '@caderno-ui/react/empty-state'
import { CadList, CadListItem } from '@caderno-ui/react/list'
import { useNotes } from './notes-provider'

export function NotesList() {
  const { notes, ready, error } = useNotes()
  if (!ready)
    return (
      <p className="cad-type-meta notes-status" role="status">
        {error
          ? 'Your notes have not been changed.'
          : 'Reading notes from this browser…'}
      </p>
    )
  if (!notes.length)
    return (
      <CadEmptyState>
        <h2 slot="title">No notes yet</h2>
        <p slot="description">Keep your first idea here.</p>
        <Link slot="primary" href="/edit/">
          Create a note
        </Link>
      </CadEmptyState>
    )
  return (
    <div className="notes-stack">
      <div className="notes-heading">
        <p className="cad-type-meta">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </p>
        <Link href="/edit/">Create a note</Link>
      </div>
      <CadList label="Saved notes">
        {notes.map((note) => (
          <CadListItem key={note.id}>
            <Link
              slot="action"
              href={{ pathname: '/edit/', query: { id: note.id } }}
            >
              {note.title}
            </Link>
          </CadListItem>
        ))}
      </CadList>
    </div>
  )
}

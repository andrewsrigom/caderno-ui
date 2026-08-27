'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useState, type FormEvent } from 'react'
import type { CadInput as InputElement } from '@caderno-ui/elements/input'
import { CadButton } from '@caderno-ui/react/button'
import { CadCheckbox } from '@caderno-ui/react/checkbox'
import { CadInput } from '@caderno-ui/react/input'
import { CadTextarea } from '@caderno-ui/react/textarea'
import { CadModal } from '@caderno-ui/react/modal'
import { CadAlert } from '@caderno-ui/react/alert'
import { useNotes } from '../notes-provider'
import type { Note } from '../storage'

export function NoteEditor() {
  const { notes, ready, error } = useNotes()
  const params = useSearchParams()
  const id = params.get('id')
  if (!ready && error) return null
  if (!ready)
    return (
      <p className="cad-type-meta" role="status">
        Waiting for browser storage…
      </p>
    )
  const note = notes.find((item) => item.id === id)
  if (id && !note)
    return (
      <CadAlert heading="Note not found">
        It may have been removed in another tab.{' '}
        <Link href="/">Back to notes</Link>
      </CadAlert>
    )
  return <EditorForm key={id ?? 'new'} note={note} />
}

function EditorForm({ note }: { note?: Note }) {
  const { save, remove } = useNotes()
  const router = useRouter()
  const input = useRef<InputElement>(null)
  const [title, setTitle] = useState(note?.title ?? '')
  const [body, setBody] = useState(note?.body ?? '')
  const [reviewed, setReviewed] = useState(note?.reviewed ?? false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [failure, setFailure] = useState('')

  function reset() {
    setTitle(note?.title ?? '')
    setBody(note?.body ?? '')
    setReviewed(note?.reviewed ?? false)
    setFailure('')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    if (!title.trim()) {
      setFailure('Give this note a title.')
      input.current?.focus()
      return
    }
    setSaving(true)
    setFailure('')
    try {
      await save({
        id: note?.id ?? crypto.randomUUID(),
        title: title.trim(),
        body,
        reviewed,
      })
      router.push('/')
    } catch {
      setFailure(
        'Your draft is still here. Check storage permissions or available space, then try saving again.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!note || saving) return
    setSaving(true)
    try {
      await remove(note.id)
      setDeleting(false)
      router.push('/')
    } catch {
      setFailure('The note could not be deleted. It has been kept.')
      setDeleting(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="notes-stack">
      <Link href="/">Back to notes</Link>
      {failure && (
        <CadAlert variant="danger" heading="Check this note">
          {failure}
        </CadAlert>
      )}
      <form
        className="notes-stack"
        onSubmit={(event) => {
          void submit(event)
        }}
        onReset={reset}
      >
        <CadInput
          ref={input}
          label="Title"
          name="title"
          required
          maxLength={160}
          value={title}
          onInput={(event) => setTitle(event.currentTarget.value)}
        />
        <CadTextarea
          label="Note"
          name="body"
          rows={8}
          value={body}
          onInput={(event) => setBody(event.currentTarget.value)}
        />
        <CadCheckbox
          label="Reviewed"
          name="reviewed"
          checked={reviewed}
          onChange={(event) => setReviewed(event.currentTarget.checked)}
        />
        <div className="notes-actions">
          <CadButton type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save note'}
          </CadButton>
          <CadButton type="reset" variant="secondary" disabled={saving}>
            Reset changes
          </CadButton>
          {note && (
            <CadButton
              type="button"
              variant="link"
              tone="coral"
              disabled={saving}
              onClick={() => setDeleting(true)}
            >
              Delete note
            </CadButton>
          )}
        </div>
      </form>
      <CadModal
        heading="Delete this note?"
        tone="danger"
        open={deleting}
        onModalClose={() => setDeleting(false)}
      >
        <p>This removes the note from this browser. It cannot be undone.</p>
        <CadButton
          slot="footer"
          variant="link"
          onClick={() => setDeleting(false)}
        >
          Keep note
        </CadButton>
        <CadButton
          slot="footer"
          tone="coral"
          disabled={saving}
          onClick={() => {
            void confirmDelete()
          }}
        >
          Delete permanently
        </CadButton>
      </CadModal>
    </div>
  )
}

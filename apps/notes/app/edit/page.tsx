import { Suspense } from 'react'
import { NoteEditor } from './note-editor'

export const metadata = { title: 'Edit note' }

export default function Page() {
  return (
    <section className="notes-stack" aria-labelledby="editor-title">
      <h1 id="editor-title" className="cad-type-heading">
        Write a note
      </h1>
      <Suspense
        fallback={
          <p className="cad-type-meta" role="status">
            Opening the editor…
          </p>
        }
      >
        <NoteEditor />
      </Suspense>
    </section>
  )
}

import { NotesList } from '../notes-list'

export default function Page() {
  return (
    <section className="notes-stack" aria-labelledby="notes-title">
      <header className="notes-stack">
        <h1 id="notes-title" className="cad-type-heading">
          Your notes
        </h1>
        <p className="cad-type-body">
          A thought, a decision, a useful reminder.
        </p>
      </header>
      <NotesList />
    </section>
  )
}

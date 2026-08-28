import { KanbanBoard } from './kanban-board'

export const metadata = {
  title: 'Kanban',
  description: 'A local task board built with Caderno UI, React, and Next.js.',
}

export default function KanbanPage() {
  return (
    <section className="kanban-page notes-stack" aria-labelledby="board-title">
      <header className="notes-stack">
        <h1 id="board-title" className="cad-type-heading">
          Your board
        </h1>
        <p className="cad-type-body">Move tasks from To do to Done.</p>
      </header>
      <KanbanBoard />
    </section>
  )
}

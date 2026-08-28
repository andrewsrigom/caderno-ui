# Caderno Notes

A notes app and a Kanban board built with React and Next.js App Router. Both start
empty and store data in this browser. No backend or authentication.

- `/`: create, edit and delete notes. Storage key: `caderno-ui:notes-example:v1`.
- `/kanban/`: create and edit tasks, move them between To do, In progress and
  Done, undo moves, and confirm deletion. Storage key: `caderno-ui:kanban-example:v1`.

The board uses `CadKanban`, `CadKanbanColumn` and `CadKanbanCard`. Drag cards on
desktop, or use the Start, Finish and Reopen buttons with a keyboard or touch.
The task form can move a task to any column. Ordering within a column is not
editable. Sample tasks are added only when you choose **Try example tasks**.

Storage failures preserve saved data and open drafts. Other tabs refresh from
storage; concurrent edits to the same item are last-write-wins. Notes and tasks
use separate storage keys, and opening the board does not read or change notes.

From the repository root:

```sh
pnpm build:packages
pnpm --filter @caderno-ui/notes-example dev
```

The development app uses port 5190. The public example is a static export built
by `pnpm docs:check` at `/caderno-ui/examples/react/`, with the board at
`/caderno-ui/examples/react/kanban/`.

`pnpm pack:check && pnpm test:frameworks` installs tarballs in a fresh OS
temporary directory and checks both a static export and a separate Next.js
server. The server-only fixture calls `connection()` and changes its render ID
on every request; it is not included in the public static app.

Component appearance comes entirely from public Caderno UI exports. Local CSS
only arranges the app. Slotted HTML renders on the server; Lit shadow roots
render in the browser. Reading and editing locally stored notes and tasks requires
JavaScript.

Unmodified Caveat fonts are self-hosted under SIL OFL 1.1; see
`public/Caveat-OFL.txt`. No font binaries are added to the library packages.

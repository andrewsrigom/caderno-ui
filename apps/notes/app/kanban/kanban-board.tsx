'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { CadAlert } from '@caderno-ui/react/alert'
import { CadButton } from '@caderno-ui/react/button'
import { CadInput } from '@caderno-ui/react/input'
import {
  CadKanban,
  CadKanbanCard,
  CadKanbanColumn,
} from '@caderno-ui/react/kanban'
import { CadModal } from '@caderno-ui/react/modal'
import { CadRadio } from '@caderno-ui/react/radio'
import { CadTextarea } from '@caderno-ui/react/textarea'
import { CadToastHost, toast } from '@caderno-ui/react/toast'
import {
  BOARD_KEY,
  columns,
  readTasks,
  updateBoard,
  type BoardCommand,
  type Task,
  type TaskStatus,
} from './storage'

const hostId = 'kanban-example-feedback'
const nextStatus: Record<TaskStatus, TaskStatus> = {
  todo: 'doing',
  doing: 'done',
  done: 'todo',
}
const moveLabels: Record<TaskStatus, string> = {
  todo: 'Start →',
  doing: 'Finish →',
  done: 'Reopen →',
}
const statusTitle = (status: TaskStatus) =>
  columns.find((column) => column.id === status)!.title

function exampleTasks(): Task[] {
  return [
    {
      title: 'Outline the next article',
      description: 'Choose one question worth answering.',
      status: 'todo' as const,
    },
    {
      title: 'Collect reference links',
      description: 'Keep the original sources beside your notes.',
      status: 'todo' as const,
    },
    {
      title: 'Write the introduction',
      description: 'Start with the problem, then show an example.',
      status: 'doing' as const,
    },
    {
      title: 'Review the examples',
      description: 'Read each snippet as someone trying it for the first time.',
      status: 'doing' as const,
    },
    {
      title: 'Publish the reading list',
      description: 'A short list for the next study session.',
      status: 'done' as const,
    },
  ].map((task) => ({ ...task, id: crypto.randomUUID() }))
}

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [ready, setReady] = useState(false)
  const [failure, setFailure] = useState('')
  const [editor, setEditor] = useState<{ task?: Task } | null>(null)
  const [deleting, setDeleting] = useState<Task | null>(null)
  const [deleteFailure, setDeleteFailure] = useState(false)
  const dragged = useRef<string | null>(null)
  const editorFocusTarget = useRef<string | null>(null)
  const returnToNewTask = useRef(false)
  const load = useCallback(() => {
    try {
      setTasks(readTasks(window.localStorage))
      setReady(true)
      setFailure('')
    } catch {
      setFailure(
        'Saved tasks could not be read. Nothing has been overwritten. Check browser storage permissions, then try again.',
      )
    }
  }, [])

  useEffect(() => {
    load()
    const onStorage = (event: StorageEvent) => {
      if (event.key === BOARD_KEY || event.key === null) load()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      toast.dismiss(undefined, { hostId })
    }
  }, [load])

  function commit(command: BoardCommand, message?: string) {
    try {
      if (!ready) throw new Error('Storage is not ready.')
      setTasks(updateBoard(window.localStorage, command))
      setFailure('')
      if (message) toast.success(message, { hostId })
      return true
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Storage is unavailable.'
      setFailure(
        `Could not save this change. ${message} Your stored tasks and current draft have been kept.`,
      )
      toast.error('Change not saved. Your tasks have been kept.', { hostId })
      return false
    }
  }

  function focusTask(id: string) {
    requestAnimationFrame(() =>
      document.getElementById(`edit-task-${id}`)?.focus(),
    )
  }

  function move(task: Task, status: TaskStatus) {
    if (task.status === status) return
    if (!commit({ type: 'move', id: task.id, status, from: task.status }))
      return
    focusTask(task.id)
    toast.success(`Moved “${task.title}” to ${statusTitle(status)}.`, {
      hostId,
      duration: 7000,
      action: {
        label: 'Undo',
        onClick: () => {
          if (
            commit(
              { type: 'move', id: task.id, status: task.status, from: status },
              'Move undone',
            )
          ) {
            focusTask(task.id)
          }
        },
      },
    })
  }

  return (
    <div className="notes-stack">
      <div className="notes-heading">
        <p className="cad-type-meta notes-status" id="board-help">
          Drag cards between columns, or use Start, Finish, and Reopen.
        </p>
        <div className="notes-actions">
          {ready && !tasks.length && (
            <CadButton
              variant="link"
              onClick={() =>
                commit(
                  { type: 'examples', tasks: exampleTasks() },
                  'Example tasks added',
                )
              }
            >
              Try example tasks
            </CadButton>
          )}
          <CadButton
            id="new-task"
            disabled={!ready}
            onClick={() => setEditor({})}
          >
            New task
          </CadButton>
        </div>
      </div>
      {failure && (
        <CadAlert variant="danger" heading="Check browser storage">
          {failure}
          <CadButton slot="action" variant="link" onClick={load}>
            Try again
          </CadButton>
        </CadAlert>
      )}
      {!ready && !failure && (
        <p role="status" className="cad-type-meta">
          Tasks are stored in this browser. Enable JavaScript to read and save
          them.
        </p>
      )}
      {ready && !tasks.length && (
        <p className="cad-type-body notes-status">
          No tasks yet. Add your own, or try a few examples.
        </p>
      )}
      <CadKanban label="Your task board" aria-describedby="board-help">
        {columns.map((column) => (
          <CadKanbanColumn
            key={column.id}
            title={column.title}
            data-status={column.id}
            onDragOver={(event) => {
              if (dragged.current) {
                event.preventDefault()
                event.dataTransfer.dropEffect = 'move'
              }
            }}
            onDrop={(event) => {
              const task = tasks.find((item) => item.id === dragged.current)
              if (!task) return
              event.preventDefault()
              dragged.current = null
              move(task, column.id)
            }}
          >
            <h2 slot="title">{column.title}</h2>
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <CadKanbanCard
                  key={task.id}
                  tone={task.status === 'doing' ? 'blue' : 'lemon'}
                  data-task-id={task.id}
                  draggable={ready}
                  onDragStart={(event) => {
                    if (
                      event.target instanceof Element &&
                      event.target.closest(
                        'cad-button, a, input, textarea, button',
                      )
                    ) {
                      event.preventDefault()
                      return
                    }
                    dragged.current = task.id
                    event.dataTransfer.effectAllowed = 'move'
                    event.dataTransfer.setData('text/plain', task.title)
                  }}
                  onDragEnd={() => {
                    dragged.current = null
                  }}
                >
                  <div className="kanban-card-content">
                    <h3 className="cad-type-title">{task.title}</h3>
                    {task.description && (
                      <p className="cad-type-body notes-status">
                        {task.description.length > 140
                          ? `${task.description.slice(0, 140)}…`
                          : task.description}
                      </p>
                    )}
                    <div className="kanban-card-actions">
                      <CadButton
                        id={`edit-task-${task.id}`}
                        size="sm"
                        variant="link"
                        label={`Edit ${task.title}`}
                        onClick={() => setEditor({ task })}
                      >
                        Edit
                      </CadButton>
                      <CadButton
                        size="sm"
                        variant="link"
                        label={`Move ${task.title} to ${statusTitle(nextStatus[task.status])}`}
                        onClick={() => move(task, nextStatus[task.status])}
                      >
                        {moveLabels[task.status]}
                      </CadButton>
                      <CadButton
                        size="sm"
                        variant="link"
                        tone="coral"
                        label={`Delete ${task.title}`}
                        onClick={() => {
                          setDeleteFailure(false)
                          setDeleting(task)
                        }}
                      >
                        Delete
                      </CadButton>
                    </div>
                  </div>
                </CadKanbanCard>
              ))}
          </CadKanbanColumn>
        ))}
      </CadKanban>
      <CadModal
        heading={editor?.task ? 'Edit task' : 'New task'}
        open={editor !== null}
        onModalClose={() => {
          setEditor(null)
          const id = editorFocusTarget.current
          editorFocusTarget.current = null
          // Let the native dialog restore its trigger before focusing the saved card.
          if (id) focusTask(id)
        }}
      >
        <h2 slot="title">{editor?.task ? 'Edit task' : 'New task'}</h2>
        {editor && (
          <TaskForm
            key={editor.task?.id ?? 'new'}
            task={editor.task}
            onCancel={() => setEditor(null)}
            onSave={(task) => {
              if (
                !commit(
                  { type: editor.task ? 'edit' : 'create', task },
                  editor.task ? 'Task saved' : 'Task added',
                )
              )
                return false
              editorFocusTarget.current = task.id
              setEditor(null)
              return true
            }}
          />
        )}
      </CadModal>
      <CadModal
        heading="Delete this task?"
        tone="danger"
        open={deleting !== null}
        onModalClose={() => {
          setDeleting(null)
          if (returnToNewTask.current) {
            returnToNewTask.current = false
            requestAnimationFrame(() =>
              document.getElementById('new-task')?.focus(),
            )
          }
        }}
      >
        <h2 slot="title">Delete this task?</h2>
        <p>“{deleting?.title}” will be removed from this board.</p>
        {deleteFailure && (
          <CadAlert variant="danger" heading="Task not deleted">
            This task has been kept. Check browser storage, then try again.
          </CadAlert>
        )}
        <CadButton
          slot="footer"
          variant="link"
          onClick={() => setDeleting(null)}
        >
          Keep task
        </CadButton>
        <CadButton
          slot="footer"
          tone="coral"
          onClick={() => {
            if (!deleting) return
            if (!commit({ type: 'remove', id: deleting.id }, 'Task deleted')) {
              setDeleteFailure(true)
              return
            }
            returnToNewTask.current = true
            setDeleting(null)
          }}
        >
          Delete task
        </CadButton>
      </CadModal>
      <CadToastHost id={hostId} label="Board notifications" />
    </div>
  )
}

function TaskForm({
  task,
  onSave,
  onCancel,
}: {
  task?: Task
  onSave: (task: Task) => boolean
  onCancel: () => void
}) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'todo')
  const [failure, setFailure] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) {
      setFailure('Give this task a title.')
      return
    }
    if (
      !onSave({
        id: task?.id ?? crypto.randomUUID(),
        title: title.trim(),
        description,
        status,
      })
    ) {
      setFailure(
        'This draft is still here. Check browser storage, then try saving again.',
      )
    }
  }

  return (
    <form
      className="notes-stack"
      onSubmit={submit}
      onReset={() => {
        setTitle(task?.title ?? '')
        setDescription(task?.description ?? '')
        setStatus(task?.status ?? 'todo')
        setFailure('')
      }}
    >
      {failure && (
        <CadAlert variant="danger" heading="Task not saved">
          {failure}
        </CadAlert>
      )}
      <CadInput
        label="Title"
        name="title"
        required
        maxLength={160}
        value={title}
        onInput={(event) => setTitle(event.currentTarget.value)}
      />
      <CadTextarea
        label="Details"
        name="description"
        rows={4}
        maxLength={5000}
        value={description}
        onInput={(event) => setDescription(event.currentTarget.value)}
      />
      <div
        role="radiogroup"
        aria-labelledby="task-status-label"
        className="notes-field"
      >
        <span id="task-status-label" className="cad-type-label">
          Column
        </span>
        <div className="notes-actions">
          {columns.map((column) => (
            <CadRadio
              key={column.id}
              name="status"
              label={column.title}
              value={column.id}
              checked={status === column.id}
              onChange={(event) => {
                if (event.currentTarget.checked) setStatus(column.id)
              }}
            />
          ))}
        </div>
      </div>
      <div className="notes-actions">
        <CadButton type="submit">{task ? 'Save task' : 'Add task'}</CadButton>
        <CadButton type="reset" variant="secondary">
          Reset changes
        </CadButton>
        <CadButton type="button" variant="link" onClick={onCancel}>
          Cancel
        </CadButton>
      </div>
    </form>
  )
}

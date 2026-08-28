export const BOARD_KEY = 'caderno-ui:kanban-example:v1'

export const columns = [
  { id: 'todo', title: 'To do' },
  { id: 'doing', title: 'In progress' },
  { id: 'done', title: 'Done' },
] as const

export type TaskStatus = (typeof columns)[number]['id']
export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
}
export type BoardCommand =
  | { type: 'create'; task: Task }
  | { type: 'edit'; task: Task }
  | { type: 'remove'; id: string }
  | { type: 'move'; id: string; status: TaskStatus; from?: TaskStatus }
  | { type: 'examples'; tasks: Task[] }

type BoardStorage = Pick<Storage, 'getItem' | 'setItem'>

function isStatus(value: unknown): value is TaskStatus {
  return columns.some((column) => column.id === value)
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    task.id.length > 0 &&
    typeof task.title === 'string' &&
    task.title.trim().length > 0 &&
    task.title.length <= 160 &&
    typeof task.description === 'string' &&
    task.description.length <= 5000 &&
    isStatus(task.status)
  )
}

function validate(tasks: unknown): asserts tasks is Task[] {
  if (
    !Array.isArray(tasks) ||
    !tasks.every(isTask) ||
    new Set(tasks.map((task) => task.id)).size !== tasks.length
  ) {
    throw new Error('Unrecognized board data. Nothing has been overwritten.')
  }
}

export function readTasks(storage: Pick<Storage, 'getItem'>): Task[] {
  const raw = storage.getItem(BOARD_KEY)
  if (raw === null) return []
  const file: unknown = JSON.parse(raw)
  if (
    !file ||
    typeof file !== 'object' ||
    !('version' in file) ||
    file.version !== 1 ||
    !('tasks' in file)
  ) {
    throw new Error('Unrecognized board data. Nothing has been overwritten.')
  }
  validate(file.tasks)
  return file.tasks
}

export function updateBoard(
  storage: BoardStorage,
  command: BoardCommand,
): Task[] {
  // Read the latest board before every write; unrelated tasks and keys survive.
  const current = readTasks(storage)
  let next: Task[]
  if (command.type === 'examples') {
    if (current.length) throw new Error('Example tasks require an empty board.')
    next = command.tasks
  } else if (command.type === 'create') {
    if (current.some((task) => task.id === command.task.id)) {
      throw new Error('This task already exists.')
    }
    next = [...current, command.task]
  } else {
    const id = command.type === 'edit' ? command.task.id : command.id
    const existing = current.find((task) => task.id === id)
    if (!existing) throw new Error('This task was removed in another tab.')
    if (command.type === 'move') {
      if (command.from && existing.status !== command.from) {
        throw new Error(
          'This task has moved again. The latest status was kept.',
        )
      }
      next = current.map((task) =>
        task.id === id ? { ...task, status: command.status } : task,
      )
    } else if (command.type === 'edit') {
      next = current.map((task) => (task.id === id ? command.task : task))
    } else {
      next = current.filter((task) => task.id !== id)
    }
  }
  validate(next)
  storage.setItem(BOARD_KEY, JSON.stringify({ version: 1, tasks: next }))
  return next
}

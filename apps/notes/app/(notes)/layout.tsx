import type { ReactNode } from 'react'
import { NotesProvider } from '../notes-provider'

export default function NotesLayout({ children }: { children: ReactNode }) {
  return <NotesProvider>{children}</NotesProvider>
}

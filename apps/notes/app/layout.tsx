import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { CadHeader } from '@caderno-ui/react/header'
import { CadFooter } from '@caderno-ui/react/footer'
import '@fontsource/caveat/latin-500.css'
import '@fontsource/caveat/latin-700.css'
import '@caderno-ui/tokens/notebook.css'
import '@caderno-ui/elements/fallback.css'
import '@caderno-ui/elements/prose.css'
import '@caderno-ui/elements/scrollbar.css'
import './layout.css'

export const metadata: Metadata = {
  title: { default: 'Notes · Caderno UI', template: '%s · Caderno UI Notes' },
  description:
    'A small notes app built with Caderno UI and Next.js. Your notes stay in this browser.',
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="cad-prose">
        <CadHeader label="Caderno UI Notes">
          <Link slot="brand" href="/" className="cad-type-title">
            Caderno Notes
          </Link>
          <Link href="/">All notes</Link>
          <Link href="/kanban/">Kanban</Link>
          <a
            slot="actions"
            href="https://andrewsrigom.github.io/caderno-ui/integrations/react/"
          >
            React example
          </a>
        </CadHeader>
        <main id="content" className="notes-main">
          {children}
        </main>
        <CadFooter variant="minimal" label="About this example">
          <p slot="bottom" className="cad-type-meta">
            Built with Caderno UI + Next.js. Notes and tasks stay in this
            browser.
          </p>
        </CadFooter>
      </body>
    </html>
  )
}

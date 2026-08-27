import { connection } from 'next/server'
import { randomUUID } from 'node:crypto'
import {
  CadCard,
  CadCardContent,
  CadCardHeader,
  CadCardTitle,
} from '@caderno-ui/react/card'
import { CadInput } from '@caderno-ui/react/input'

// Not copied into the static demo. This route must render at request time.
export default async function ServerCheck() {
  await connection()
  return (
    <section>
      <h1>Request-time rendering</h1>
      <output data-server-render>{randomUUID()}</output>
      <CadCard>
        <CadCardHeader>
          <CadCardTitle>
            <h2>Server-rendered note</h2>
          </CadCardTitle>
        </CadCardHeader>
        <CadCardContent>Readable before JavaScript.</CadCardContent>
      </CadCard>
      <CadInput label="Server value" value="From the server" />
    </section>
  )
}

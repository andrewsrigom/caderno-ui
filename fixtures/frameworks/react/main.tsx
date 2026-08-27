import { StrictMode, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Link, MemoryRouter, useLocation, useNavigate } from 'react-router'
import { CadInput } from '@caderno-ui/react/input'
import { CadCheckbox } from '@caderno-ui/react/checkbox'
import { CadTextarea } from '@caderno-ui/react/textarea'
import { CadSwitch } from '@caderno-ui/react/switch'
import { CadRadio } from '@caderno-ui/react/radio'
import { CadSlider } from '@caderno-ui/react/slider'
import { CadButton } from '@caderno-ui/react/button'
import { CadList, CadListItem } from '@caderno-ui/react/list'
import { CadModal } from '@caderno-ui/react/modal'
import '@caderno-ui/tokens/notebook.css'
import '@caderno-ui/elements/fallback.css'
import type { CadInput as InputElement } from '@caderno-ui/elements/input'

function App() {
  const [value, setValue] = useState('Original')
  const [checked, setChecked] = useState(false)
  const [checkboxInputs, setCheckboxInputs] = useState<boolean[]>([])
  const [body, setBody] = useState('Original body')
  const [autoSave, setAutoSave] = useState(false)
  const [kind, setKind] = useState(false)
  const [depth, setDepth] = useState(60)
  const [disabled, setDisabled] = useState(false)
  const [changes, setChanges] = useState(0)
  const [data, setData] = useState('')
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState(false)
  const input = useRef<InputElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <main>
      <h1>React consumer</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setData(JSON.stringify([...new FormData(event.currentTarget)]))
        }}
        onReset={() => {
          setValue('Original')
          setChecked(false)
          setBody('Original body')
          setAutoSave(false)
          setKind(false)
          setDepth(60)
        }}
      >
        <fieldset disabled={disabled}>
          <CadInput
            ref={input}
            label="Title"
            name="title"
            required
            value={value}
            onInput={(event) => setValue(event.currentTarget.value)}
            onChange={() => setChanges((count) => count + 1)}
          />
          <CadCheckbox
            label="Reviewed"
            name="reviewed"
            checked={checked}
            onInput={(event) => {
              const next = event.currentTarget.checked
              setCheckboxInputs((values) => [...values, next])
            }}
            onChange={(event) => setChecked(event.currentTarget.checked)}
          />
          <CadTextarea
            label="Body"
            name="body"
            value={body}
            onInput={(event) => setBody(event.currentTarget.value)}
          />
          <CadSwitch
            label="Auto-save"
            name="autoSave"
            checked={autoSave}
            onChange={(event) => setAutoSave(event.currentTarget.checked)}
          />
          <CadRadio
            label="Personal note"
            name="kind"
            value="personal"
            checked={kind}
            onChange={(event) => setKind(event.currentTarget.checked)}
          />
          <CadSlider
            label="Depth"
            name="depth"
            value={depth}
            onInput={(event) => setDepth(event.currentTarget.value)}
          />
          <CadButton type="submit">Submit</CadButton>
          <CadButton type="reset">Reset</CadButton>
        </fieldset>
      </form>
      <button onClick={() => setValue('External')}>Set external value</button>
      <button
        onClick={() => {
          setBody('External body')
          setChecked(true)
          setAutoSave(true)
          setKind(true)
          setDepth(80)
        }}
      >
        Set external controls
      </button>
      <button onClick={() => setDisabled((value) => !value)}>
        {disabled ? 'Enable form' : 'Disable form'}
      </button>
      <button onClick={() => input.current?.focus()}>Focus title</button>
      <output aria-label="Value">{value}</output>
      <output aria-label="Changes">{changes}</output>
      <output aria-label="Checkbox input states">
        {JSON.stringify(checkboxInputs)}
      </output>
      <output aria-label="Form data">{data}</output>
      <output aria-label="Route">{location.pathname}</output>
      <CadList label="Routes">
        <CadListItem>Static item</CadListItem>
        <CadListItem>
          <Link slot="action" to="/notes">
            Open notes
          </Link>
        </CadListItem>
      </CadList>
      <button onClick={() => setAction((value) => !value)}>
        Toggle action slot
      </button>
      <CadList label="Dynamic slots">
        <CadListItem>
          {action ? (
            <button slot="action" onClick={() => navigate('/new')}>
              Create note
            </button>
          ) : (
            'No action yet'
          )}
        </CadListItem>
      </CadList>
      <CadButton onClick={() => setOpen(true)}>Open modal</CadButton>
      <CadModal
        heading="Review note"
        open={open}
        onModalClose={() => setOpen(false)}
      >
        <p>Review before saving.</p>
        <CadButton slot="footer" onClick={() => setOpen(false)}>
          Keep editing
        </CadButton>
      </CadModal>
    </main>
  )
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </StrictMode>,
)

import reactConsumer from '../../../../fixtures/frameworks/react/main.tsx?raw'
import vueConsumer from '../../../../fixtures/frameworks/vue/App.vue?raw'
import svelteConsumer from '../../../../fixtures/frameworks/svelte/App.svelte?raw'

const styles = `import '@fontsource/caveat/latin-500.css'
import '@fontsource/caveat/latin-700.css'
import '@caderno-ui/tokens/notebook.css'
import '@caderno-ui/elements/fallback.css'
import '@caderno-ui/elements/prose.css' // optional: native editorial content
import '@caderno-ui/elements/scrollbar.css' // optional`

export const integrations = {
  html: {
    title: 'HTML',
    description: 'Native custom elements. No framework required.',
    install:
      'pnpm add @caderno-ui/elements @caderno-ui/tokens @fontsource/caveat',
    language: 'html',
    example: `<cad-input id="title" label="Title" name="title"></cad-input>
<cad-list label="Notes">
  <cad-list-item>A plain item.</cad-list-item>
  <cad-list-item><a slot="action" href="/notes/">Open notes</a></cad-list-item>
</cad-list>
<script type="module">
  import '@caderno-ui/elements/input'
  import '@caderno-ui/elements/list'
  document.querySelector('#title').addEventListener('input', (event) => {
    console.log(event.currentTarget.value)
  })
</script>`,
    notes: [
      'Use a build tool such as Vite to resolve package imports. A plain browser needs an import map or bundled URLs.',
      'Use attributes for primitives, DOM properties for arrays and objects, and slots for markup. Register an element before assigning properties.',
      'Listen to input while editing and change on commitment. Custom cad-* events carry their payload in event.detail.',
    ],
  },
  astro: {
    title: 'Astro',
    description: 'Thin facades with native content before JavaScript.',
    install:
      'pnpm add @caderno-ui/astro @caderno-ui/elements @caderno-ui/tokens @fontsource/caveat',
    language: 'astro',
    example: `---
import Card from '@caderno-ui/astro/Card.astro'
import CardTitle from '@caderno-ui/astro/CardTitle.astro'
import List from '@caderno-ui/astro/List.astro'
import ListItem from '@caderno-ui/astro/ListItem.astro'
---
<Card>
  <CardTitle><h2>A useful decision</h2></CardTitle>
  <p>Keep behavior in the library.</p>
</Card>
<List label="Notes">
  <ListItem>Read the contract.</ListItem>
  <ListItem><a {...{ slot: 'action' }} href="/notes/">Open notes</a></ListItem>
</List>`,
    notes: [
      'Import styles once in the application layout. Facades register only their own elements; no client:* directive is needed.',
      'Spread a native child’s slot attribute when it must reach the custom element, as in the list above. Use normal Astro slots for the facade’s named slots.',
      'Set complex properties and attach native event listeners in a browser script. Server-rendered slotted content is available before upgrade; internal controls still need JavaScript.',
    ],
  },
  react: {
    title: 'React',
    description:
      'Typed adapters for React 18 and 19. One implementation underneath.',
    install:
      'pnpm add @caderno-ui/react @caderno-ui/elements @caderno-ui/tokens @fontsource/caveat',
    language: 'tsx',
    example: reactConsumer,
    notes: [
      'onInput fires while editing. onChange follows native commitment: blur for text, toggle for checkboxes, commit for sliders. This differs from React’s native text onChange.',
      'These callbacks receive DOM events. Read event.currentTarget.value or .checked synchronously; reset controlled state in the form’s onReset handler.',
      'refs point to custom elements and support their public focus and validation methods. The action slot accepts a router Link or button without owning navigation.',
      'The example below is the React Router consumer exercised from installed tarballs in Strict Mode. It checks external state, FormData, reset, slots and focus.',
    ],
  },
  next: {
    title: 'Next.js',
    description: 'App Router with explicit server and client boundaries.',
    install:
      'pnpm add @caderno-ui/react @caderno-ui/elements @caderno-ui/tokens @fontsource/caveat',
    language: 'tsx',
    example: `// app/page.tsx — Server Component
import { CadCard, CadCardTitle, CadCardContent } from '@caderno-ui/react/card'
import { SaveNote } from './save-note'

export default function Page() {
  return <CadCard>
    <CadCardTitle><h1>A useful decision</h1></CadCardTitle>
    <CadCardContent><p>Readable before JavaScript.</p></CadCardContent>
    <SaveNote />
  </CadCard>
}

// app/save-note.tsx — Client Component
'use client'
import { CadButton } from '@caderno-ui/react/button'
import { CadToastHost, toast } from '@caderno-ui/react/toast'

export function SaveNote() {
  return <>
    <CadToastHost id="note-feedback" />
    <CadButton onClick={() => toast.success('Saved', { hostId: 'note-feedback' })}>
      Save note
    </CadButton>
  </>
}`,
    notes: [
      'React component entrypoints retain use client in the published ESM. A Server Component can compose them; event handlers belong inside a Client Component.',
      'Import global styles and fonts in app/layout.tsx. Pass serializable data across the boundary and use native headings, paragraphs and links in slots.',
      'This is not Lit shadow-root SSR. Slotted HTML is rendered on the server; internal controls initialize in the browser. No ssr: false or hydration-warning suppression is used.',
      'The notes miniapp is a static export. A separate next build / next start consumer verifies request-time SSR and hydration using the same tarballs. Static hosting alone is not evidence of SSR.',
    ],
  },
  vue: {
    title: 'Vue',
    description: 'Vue 3 with native custom elements. No adapter required.',
    install:
      'pnpm add @caderno-ui/elements @caderno-ui/tokens @fontsource/caveat',
    language: 'html',
    example: vueConsumer,
    notes: [
      'Configure @vitejs/plugin-vue with template.compilerOptions.isCustomElement: (tag) => tag.startsWith("cad-").',
      'Use :value.prop and :checked.prop for DOM properties, @input / @change for native events, and slot attributes for content.',
      'This executable Vite example checks properties, events and action slots. Nuxt SSR and a dedicated Vue adapter are outside this release.',
    ],
  },
  svelte: {
    title: 'Svelte',
    description: 'Svelte 5 with native custom elements. No adapter required.',
    install:
      'pnpm add @caderno-ui/elements @caderno-ui/tokens @fontsource/caveat',
    language: 'html',
    example: svelteConsumer,
    notes: [
      'Register the elements before rendering. Use reactive properties with oninput / onchange and ordinary slot attributes.',
      'This executable Vite example checks external state, events and slotted links. SvelteKit SSR and a dedicated Svelte adapter are outside this release.',
    ],
  },
} as const

export { styles }

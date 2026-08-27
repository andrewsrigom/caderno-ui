<script lang="ts">
  let title = $state('Original')
  let checked = $state(false)
  function edit(event: Event) {
    title = (event.currentTarget as HTMLElement & { value: string }).value
  }
  function toggle(event: Event) {
    checked = (event.currentTarget as HTMLElement & { checked: boolean }).checked
  }
</script>

<main>
  <h1>Svelte consumer</h1>
  <cad-input label="Title" value={title} oninput={edit}></cad-input>
  <cad-checkbox label="Reviewed" {checked} onchange={toggle}></cad-checkbox>
  <button onclick={() => { title = 'External' }}>Set external value</button>
  <output aria-label="Value">{title}</output>
  <output aria-label="Reviewed">{String(checked)}</output>
  <cad-list label="Routes">
    <cad-list-item>Static item</cad-list-item>
    <cad-list-item>
      <a slot="action" href="#notes">Open notes</a>
    </cad-list-item>
  </cad-list>
</main>

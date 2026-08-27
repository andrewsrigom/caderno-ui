<script setup lang="ts">
import { ref } from 'vue'
const title = ref('Original')
const checked = ref(false)
function edit(event: Event) {
  title.value = (event.currentTarget as HTMLElement & { value: string }).value
}
function toggle(event: Event) {
  checked.value = (
    event.currentTarget as HTMLElement & { checked: boolean }
  ).checked
}
</script>
<template>
  <main>
    <h1>Vue consumer</h1>
    <cad-input label="Title" :value.prop="title" @input="edit"></cad-input>
    <cad-checkbox
      label="Reviewed"
      :checked.prop="checked"
      @change="toggle"
    ></cad-checkbox>
    <button @click="title = 'External'">Set external value</button>
    <output aria-label="Value">{{ title }}</output
    ><output aria-label="Reviewed">{{ String(checked) }}</output>
    <cad-list label="Routes"
      ><cad-list-item>Static item</cad-list-item>
      <cad-list-item
        ><a slot="action" href="#notes">Open notes</a></cad-list-item
      >
    </cad-list>
  </main>
</template>

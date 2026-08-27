import { mount } from 'svelte'
import App from './App.svelte'
import '@caderno-ui/tokens/notebook.css'
import '@caderno-ui/elements/fallback.css'
import '@caderno-ui/elements/input'
import '@caderno-ui/elements/checkbox'
import '@caderno-ui/elements/list'
mount(App, { target: document.getElementById('root')! })

import '@fontsource/caveat/latin-500.css'
import '@fontsource/caveat/latin-700.css'
import '@caderno-ui/tokens/notebook.css'
import '@caderno-ui/elements/fallback.css'
import '@caderno-ui/elements/button'

const button = document.querySelector('cad-button')
if (button) {
  button.addEventListener('click', () => {
    console.log('Button clicked')
  })
}

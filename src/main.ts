import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerDirectives } from './directives/reveal'
import './styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// app.use(router) registers RouterLink and RouterView globally.

registerDirectives(app)
// Keep the startup screen in place until the initial lazy route can render.
router.isReady().then(async () => {
  app.mount('#app')
  await nextTick()
  requestAnimationFrame(() => window.dispatchEvent(new Event('pressidian:ready')))
}).catch((error: unknown) => {
  console.error('Unable to open the garden', error)
  window.dispatchEvent(new Event('pressidian:boot-error'))
})

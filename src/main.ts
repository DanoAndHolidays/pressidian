import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { RouterLink, RouterView } from 'vue-router'
import App from './App.vue'
import router from './router'
import { registerDirectives } from './directives/reveal'
import './styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Registered globally so `<component :is="'RouterLink'">` — used by the
// data-driven link grids — resolves the same component as the static tag.
app.component('RouterLink', RouterLink)
app.component('RouterView', RouterView)

registerDirectives(app)
app.mount('#app')

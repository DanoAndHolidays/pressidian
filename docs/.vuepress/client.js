import { defineClientConfig } from 'vuepress/client'
import NotesIndex from './components/NotesIndex.vue'
import ProjectsPage from './components/ProjectsPage.vue'
import AboutPage from './components/AboutPage.vue'
import LabPage from './components/LabPage.vue'
import PressidianLayout from './components/PressidianLayout.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('NotesIndex', NotesIndex)
    app.component('ProjectsPage', ProjectsPage)
    app.component('AboutPage', AboutPage)
    app.component('LabPage', LabPage)
  },
  layouts: {
    Layout: PressidianLayout,
  },
})

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: '花园入口', eyebrow: 'DANO · DIGITAL GARDEN' },
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('@/pages/NotesIndexPage.vue'),
    meta: { title: '知识笔记', eyebrow: 'THE KNOWLEDGE GARDEN' },
  },
  {
    path: '/notes/:pathMatch(.*)*',
    name: 'note',
    component: () => import('@/pages/NotePage.vue'),
    meta: { title: '笔记', eyebrow: 'READING' },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/pages/ProjectsPage.vue'),
    meta: { title: '项目路径', eyebrow: 'SELECTED WORK' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/AboutPage.vue'),
    meta: { title: '关于 Dano', eyebrow: 'ABOUT' },
  },
  {
    path: '/lab',
    name: 'lab',
    component: () => import('@/pages/LabPage.vue'),
    meta: { title: '狐狸实验室', eyebrow: 'FOX PLAYGROUND' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: '走丢了', eyebrow: '404' },
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) {
      return { el: to.hash, top: 104, behavior: 'smooth' }
    }
    // Moving between sibling notes should not scroll the reader back to the
    // top of the sidebar-driven layout.
    if (to.name === 'note' && from.name === 'note') return { top: 0 }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? 'Pressidian'
  document.title = to.name === 'home' ? 'Pressidian · Dano 的数字花园' : `${title} · Pressidian`
})

export default router

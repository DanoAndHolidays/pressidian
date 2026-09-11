import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

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

/**
 * Hash history, deliberately.
 *
 * GitHub Pages is a static file server with no rewrite rules, so a deep link
 * like `/pressidian/notes/whatever` has no file behind it. The usual remedy —
 * copying the entry to `404.html` — does not work here: the host answers the
 * request with a 404 status, and a browser refuses to execute an ES module
 * served under a 404, so the app never boots.
 *
 * Hash routing sidesteps the problem entirely: every URL resolves to the one
 * `index.html` on disk, and the route lives after the `#`. It also keeps local
 * previews and any future static host working without per-host configuration.
 * The trade-off is the `#` in shared links, which is worth it for a garden
 * whose notes must be linkable.
 */
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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

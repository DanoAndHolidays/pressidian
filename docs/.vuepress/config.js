import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))
const base = process.env.BASE_PATH || '/'

const theme = defaultTheme({
  logo: null,
  repo: 'https://github.com/DanoAndHolidays/Pressidian',
  navbar: [
    { text: '花园入口', link: '/' },
    { text: '笔记', link: '/notes/' },
    { text: '项目', link: '/projects/' },
    { text: '关于', link: '/about/' },
    { text: '实验室', link: '/lab/' },
  ],
  sidebar: {
    '/notes/': 'heading',
    '/projects/': false,
    '/about/': false,
    '/lab/': false,
  },
  lastUpdated: true,
  contributors: false,
  editLink: false,
  themePlugins: {
    // Public Obsidian vaults naturally contain unfinished and historical links.
    // A single dead link should not block the daily site deployment.
    linksCheck: false,
  },
})

// Replace only the default home renderer. Article pages keep VuePress' mature
// reading layout while the root route receives the custom digital-garden UI.
theme.alias['@theme/VPHome.vue'] = resolve(currentDir, 'components/HomePage.vue')

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'Pressidian',
  description: 'Dano 的前端作品与数字花园',
  base,
  head: [
    ['meta', { name: 'theme-color', content: '#24251f' }],
    ['meta', { name: 'author', content: 'Dano' }],
    ['link', { rel: 'icon', href: `${base}favicon.svg`, type: 'image/svg+xml' }],
  ],
  bundler: viteBundler(),
  markdown: {
    html: false,
    linkify: true,
  },
  theme,
})

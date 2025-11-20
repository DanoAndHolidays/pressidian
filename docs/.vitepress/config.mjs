import { defineConfig } from 'vitepress'
import sidebar from './sidebar.mjs' // 导入自动生成的侧边栏配置

console.log(sidebar)

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'Pressidian',
    base: '/pressidian/',
    description: 'Dano的笔记博客',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '首页', link: '/' },
            {
                text: '笔记',
                link: '/notes/前端/TS/TypeScript入门教程/1基础/0Hello TypeScript.md',
            },
        ],
        sidebar: sidebar,

        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/DanoAndHolidays/pressidian',
            },
        ],
    },
})

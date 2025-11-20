import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'Pressidian',
    description: '一个使用Obsidian笔记仓库构建的VitePress静态站点',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '首页', link: '/' },
            { text: '笔记', link: '/notes/' },
        ],

        sidebar: { '/notes/': [{ text: '笔记目录', items: [] }] },

        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/DanoAndHolidays/pressidian',
            },
        ],
    },
})

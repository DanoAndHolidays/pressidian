import path from 'path'
import sidebar from './sidebar.mjs' // 导入自动生成的侧边栏配置

// https://vitepress.dev/reference/site-config

import obsidianImagePlugin from '../../src/plugins/obsidian-image-plugin.js'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const SITE_BASE = '/pressidian/'

export default {
    vite: {
        build: {
            rollupOptions: {
                external: (source) =>
                    source.startsWith(`${SITE_BASE}notes/attachments/`),
            },
        },
        ssr: {
            external: [],
        },
        plugins: [
            viteStaticCopy({
                targets: [
                    {
                        src: path.resolve(
                            __dirname,
                            '../notes/attachments/**/*',
                        ),
                        dest: 'notes/attachments',
                    },
                ],
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '../../'),
            },
        },
    },
    title: 'Pressidian',
    base: SITE_BASE,
    description: 'Dano的笔记博客',
    markdown: {
        preConfig: (md) => {
            md.options.base = SITE_BASE
            obsidianImagePlugin(md)
        },
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '首页', link: '/' },
            {
                text: '笔记',
                link: '/notes/',
            },
            { text: '关于', link: '/notes/README' },
        ],
        sidebar,

        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/DanoAndHolidays/pressidian',
            },
        ],
    },
}

import path from 'path'
import sidebar from './sidebar.mjs' // 导入自动生成的侧边栏配置

// https://vitepress.dev/reference/site-config

import { viteStaticCopy } from 'vite-plugin-static-copy'

const SITE_BASE = '/pressidian/'
const ATTACHMENTS_PREFIX = `${SITE_BASE}notes/attachments/`

export default {
    vite: {
        build: {
            rollupOptions: {
                external: (source) => source.startsWith(ATTACHMENTS_PREFIX),
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

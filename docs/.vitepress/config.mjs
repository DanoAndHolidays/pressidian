import path from 'path'
import sidebar from './sidebar.mjs' // 导入自动生成的侧边栏配置

console.log(sidebar)

// https://vitepress.dev/reference/site-config

import { defineConfig } from 'vitepress'
import md from 'vite-plugin-md'

import obsidianImagePlugin from '../../src/plugins/obsidian-image-plugin.js'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    vue: {
        include: [/\.vue$/, /\.md$/],
        logLevel: 'verbose',
        transform(code, id) {
            console.log('Processing file:', id)
            return code
        },
        template: {
            compilerOptions: {
                isCustomElement: (tag) => tag.startsWith('vp-'),
            },
        },
    },
    vite: {
        build: {
            rollupOptions: {
                external: ['vue', 'vue/server-renderer'],
            },
        },
        ssr: {
            external: [],
        },
        plugins: [
            md({
                mode: 'vue',
                components: true,
                include: /notes\/.*\.md$/,
                // 确认插件初始化
                setup() {
                    console.log('[vite-plugin-md] Plugin initialized')
                },
                exclude: /node_modules/,
                debug: true,
                logLevel: 'verbose',
                transform(src, id) {
                    console.log('[vite-plugin-md] Processing:', id)
                    return src
                },
                markdownItSetup(md) {
                    md.use(obsidianImagePlugin)
                },
            }),
            viteStaticCopy({
                targets: [
                    {
                        src: './notes/attachments/**/*',
                        dest: 'public/notes/attachments',
                    },
                ],
            }),
        ],
        esbuild: {
            jsxFactory: 'h',
            jsxFragment: 'Fragment',
            jsxInject: `import { defineComponent } from 'vue'`,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '../../'),
            },
        },
    },
    title: 'Pressidian',
    base: '/pressidian/',
    description: 'Dano的笔记博客',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '首页', link: '/' },
            {
                text: '笔记',
                link: '/notes/',
            },
            { text: '关于', link: '/notes/README.md' },
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

import fs from 'fs-extra'
import path from 'path'

const SITE_BASE = '/pressidian/'
const ATTACHMENTS_PREFIX = `${SITE_BASE}notes/attachments/`
const IMAGE_PLACEHOLDER_PREFIX = '__PRESSIDIAN_IMAGE_PLACEHOLDER__'

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}

function buildImageTag(src, alt) {
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" />`
}

function protectHtmlTags(content) {
    const placeholders = []

    const protectedContent = content.replace(/<img\b[^>]*\/?>/g, (match) => {
        const placeholder = `${IMAGE_PLACEHOLDER_PREFIX}${placeholders.length}__`
        placeholders.push(match)
        return placeholder
    })

    return {
        placeholders,
        content: protectedContent,
    }
}

function escapeRawHtml(content) {
    return content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function restoreHtmlTags(content, placeholders) {
    return placeholders.reduce((result, originalTag, index) => {
        const placeholder = `${IMAGE_PLACEHOLDER_PREFIX}${index}__`
        return result.replaceAll(placeholder, originalTag)
    }, content)
}

function transformObsidianImages(content) {
    return content.replace(/!\[\[([^\]]+)\]\]/g, (_, rawImageName) => {
        const [fileName, alias = ''] = rawImageName.split('|')
        const imageName = fileName.trim()
        const alt = alias.trim() || imageName
        const imageSrc = `${ATTACHMENTS_PREFIX}${encodeURI(imageName)}`

        return buildImageTag(imageSrc, alt)
    })
}

function transformMarkdownAttachmentImages(content) {
    return content.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        (match, rawAlt, rawSrc) => {
            const src = rawSrc.trim()

            if (!src.startsWith(ATTACHMENTS_PREFIX)) {
                return match
            }

            return buildImageTag(src, rawAlt.trim())
        },
    )
}

function preprocessMarkdownFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    entries.forEach((entry) => {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            preprocessMarkdownFiles(fullPath)
            return
        }

        if (!entry.isFile() || !entry.name.endsWith('.md')) {
            return
        }

        const original = fs.readFileSync(fullPath, 'utf8')
        const transformedWithImages = transformMarkdownAttachmentImages(
            transformObsidianImages(original),
        )
        const { content: protectedContent, placeholders } = protectHtmlTags(
            transformedWithImages,
        )
        const transformed = restoreHtmlTags(
            escapeRawHtml(protectedContent),
            placeholders,
        )

        if (transformed !== original) {
            fs.writeFileSync(fullPath, transformed)
        }
    })
}

// 递归生成侧边栏结构
function generateSidebarItems(dir, baseUrl, baseDir) {
    const items = []
    const files = fs.readdirSync(dir, { withFileTypes: true })

    // 分离文件夹和文件（文件夹优先显示）
    const directories = files.filter((f) => f.isDirectory())
    const mdFiles = files.filter((f) => f.isFile() && f.name.endsWith('.md'))

    // 处理文件夹（递归）
    directories.forEach((dirent) => {
        const dirPath = path.join(dir, dirent.name)
        const children = generateSidebarItems(dirPath, baseUrl, baseDir)

        if (children.length > 0) {
            items.push({
                text: dirent.name, // 文件夹名（如“2进阶”）
                collapsed: true,
                items: children,
            })
        }
    })

    // 处理MD文件
    mdFiles.forEach((file) => {
        const fileName = file.name.replace('.md', '')
        if (fileName === 'index') return // 跳过index.md（可选）

        const relativePath = path
            .relative(baseDir, path.join(dir, file.name))
            .replace(/\\/g, '/')
        const routePath = `${baseUrl}/${relativePath.replace(/\.md$/, '')}`

        items.push({
            text: fileName, // 文件名（如“1类型别名”）
            link: routePath, // 链接路径
        })
    })

    return items
}

async function generateSidebar() {
    const notesDir = path.resolve(process.cwd(), 'docs/notes')
    preprocessMarkdownFiles(notesDir)
    // 本地笔记目录
    const sidebarOutputPath = path.join(
        process.cwd(),
        'docs/.vitepress/sidebar.mjs',
    ) // 输出配置路径
    const baseUrl = '/notes' // 基础路径（适配GitHub Pages）

    // 生成侧边栏结构
    const sidebarItems = generateSidebarItems(notesDir, baseUrl, notesDir)

    // 写入.mjs格式的配置文件（使用ES模块导出）
    const content = `export default ${JSON.stringify(
        { '/notes/': sidebarItems },
        null,
        2,
    )}`
    await fs.writeFile(sidebarOutputPath, content)

    console.log('侧边栏配置生成完成')
}

// 执行脚本
generateSidebar().catch(console.error)

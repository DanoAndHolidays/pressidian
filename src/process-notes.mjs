import fs from 'fs-extra'
import path from 'path'

const SITE_BASE = '/pressidian/'
const SOURCE_DIR = path.join(process.cwd(), 'docs/notes')
const OUTPUT_DIR = path.join(process.cwd(), 'docs/generated-notes')
const ATTACHMENTS_PREFIX = `${SITE_BASE}notes/attachments/`
const IMAGE_PLACEHOLDER_PREFIX = '__PRESSIDIAN_IMAGE_PLACEHOLDER__'

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}

function buildImageLink(src, alt) {
    return `[查看图片：${escapeHtml(alt)}](${src})`
}

function escapeRawHtml(content) {
    return content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function transformObsidianImages(content) {
    return content.replace(/!\[\[([^\]]+)\]\]/g, (_, rawImageName) => {
        const [fileName, alias = ''] = rawImageName.split('|')
        const imageName = fileName.trim()
        const alt = alias.trim() || imageName
        const imageSrc = `${ATTACHMENTS_PREFIX}${encodeURI(imageName)}`

        return buildImageLink(imageSrc, alt)
    })
}

function transformMarkdownAttachmentImages(content) {
    return content.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        (match, rawAlt, rawSrc) => {
            const src = rawSrc.trim().replace(/^<|>$/g, '')

            if (!src.startsWith(ATTACHMENTS_PREFIX)) {
                return match
            }

            return buildImageLink(src, rawAlt.trim() || src.split('/').pop())
        },
    )
}

function transformWikiLinks(content) {
    return content.replace(/(?<!!)\[\[([^\]]+)\]\]/g, (_, rawLink) => {
        const [target, alias = ''] = rawLink.split('|')
        const cleanTarget = target.trim().replace(/\.md$/i, '')
        const text = alias.trim() || cleanTarget.split('/').pop() || cleanTarget
        return `[${text}](${cleanTarget}.md)`
    })
}

function transformMarkdown(content) {
    const transformedWithImages = transformMarkdownAttachmentImages(
        transformObsidianImages(transformWikiLinks(content)),
    )
    return escapeRawHtml(transformedWithImages)
}

async function processDirectory(sourceDir, outputDir) {
    await fs.ensureDir(outputDir)
    const entries = await fs.readdir(sourceDir, { withFileTypes: true })

    for (const entry of entries) {
        const sourcePath = path.join(sourceDir, entry.name)
        const outputPath = path.join(outputDir, entry.name)

        if (entry.isDirectory()) {
            if (entry.name === 'attachments') {
                continue
            }

            await processDirectory(sourcePath, outputPath)
            continue
        }

        if (!entry.isFile()) {
            continue
        }

        if (!entry.name.endsWith('.md')) {
            await fs.copy(sourcePath, outputPath)
            continue
        }

        const original = await fs.readFile(sourcePath, 'utf8')
        const transformed = transformMarkdown(original)
        await fs.outputFile(outputPath, transformed)
    }
}

async function processNotes() {
    await fs.emptyDir(OUTPUT_DIR)
    await processDirectory(SOURCE_DIR, OUTPUT_DIR)
    console.log('笔记渲染目录生成完成')
}

processNotes().catch((error) => {
    console.error('笔记渲染目录生成失败')
    console.error(error)
    process.exit(1)
})

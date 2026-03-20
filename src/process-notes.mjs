import fs from 'fs-extra'
import path from 'path'

const SOURCE_DIR = path.join(process.cwd(), 'docs/notes')
const OUTPUT_DIR = path.join(process.cwd(), 'docs/generated-notes')
const ATTACHMENTS_DIRNAME = 'notes/attachments'

function buildImageMarkdown(src, alt) {
    return `![${alt}](${src})`
}

function escapeRawHtml(content) {
    return content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function toPosixPath(value) {
    return value.replace(/\\/g, '/')
}

function getAttachmentRelativePath(outputFilePath, imageName) {
    const outputDirectory = path.dirname(outputFilePath)
    const attachmentFilePath = path.join(
        process.cwd(),
        'docs',
        ATTACHMENTS_DIRNAME,
        imageName,
    )
    const relativePath = path.relative(outputDirectory, attachmentFilePath)
    return toPosixPath(relativePath)
        .split('/')
        .map(encodeURIComponent)
        .join('/')
}

function transformObsidianImages(content, outputFilePath) {
    return content.replace(/!\[\[([^\]]+)\]\]/g, (_, rawImageName) => {
        const [fileName, alias = ''] = rawImageName.split('|')
        const imageName = fileName.trim()
        const alt = alias.trim() || imageName
        const imageSrc = getAttachmentRelativePath(outputFilePath, imageName)

        return buildImageMarkdown(imageSrc, alt)
    })
}

function transformMarkdownAttachmentImages(content, outputFilePath) {
    return content.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        (match, rawAlt, rawSrc) => {
            const src = rawSrc.trim().replace(/^<|>$/g, '')
            const decodedSrc = decodeURIComponent(src)

            if (
                !decodedSrc.startsWith('/notes/attachments/') &&
                !decodedSrc.startsWith('/pressidian/notes/attachments/') &&
                !decodedSrc.startsWith('notes/attachments/') &&
                !decodedSrc.startsWith('./notes/attachments/') &&
                !decodedSrc.startsWith('../notes/attachments/')
            ) {
                return match
            }

            const imageName = decodedSrc.split('/').pop()
            const imageSrc = getAttachmentRelativePath(
                outputFilePath,
                imageName,
            )

            return buildImageMarkdown(imageSrc, rawAlt.trim() || imageName)
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

function transformMarkdown(content, outputFilePath) {
    const transformedWithImages = transformMarkdownAttachmentImages(
        transformObsidianImages(transformWikiLinks(content), outputFilePath),
        outputFilePath,
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
        const transformed = transformMarkdown(original, outputPath)
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

import fs from 'fs-extra'
import path from 'path'

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
        const dirUrl = path.relative(baseDir, dirPath).replace(/\\/g, '/')
        const children = generateSidebarItems(dirPath, baseUrl, baseDir)

        if (children.length > 0) {
            items.push({
                text: dirent.name, // 文件夹名（如“2进阶”）

                items: children,
            })
        }
    }),
        // 处理MD文件
        mdFiles.forEach((file) => {
            const fileName = file.name.replace('.md', '')
            if (fileName === 'index') return // 跳过index.md（可选）
            items.push({
                text: fileName, // 文件名（如“1类型别名”）
                link: path.posix.join(
                    baseUrl,
                    path
                        .relative(baseDir, path.join(dir, file.name))
                        .replace(/\\/g, '/')
                ), // 链接路径
            })
        })

    return items
}

async function generateSidebar() {
    const notesDir = path.resolve(process.cwd(), 'docs/notes')
    // 本地笔记目录
    const sidebarOutputPath = path.join(
        process.cwd(),
        'docs/.vitepress/sidebar.mjs'
    ) // 输出配置路径
    const baseUrl = '/notes' // 基础路径（适配GitHub Pages）

    // 生成侧边栏结构
    const sidebarItems = generateSidebarItems(notesDir, baseUrl, notesDir)

    // 写入.mjs格式的配置文件（使用ES模块导出）
    const content = `export default ${JSON.stringify(
        { '/notes/': sidebarItems },
        null,
        2
    )}`
    await fs.writeFile(sidebarOutputPath, content)

    console.log('侧边栏配置生成完成')
}

// 执行脚本
generateSidebar().catch(console.error)

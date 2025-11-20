// 注意：.mjs使用ES模块语法（import/export）
import fs from 'fs-extra'
import path from 'path'

// 路径配置（基于你的目录结构）
const notesDir = path.join(process.cwd(), 'docs/notes') // 本地测试笔记目录
const publicAssetsDir = path.join(process.cwd(), 'docs/public/assets') // 附件目录

async function processNotes() {
    // 清空旧附件（可选，测试阶段可注释）
    // await fs.emptyDir(publicAssetsDir);

    // 使用obsidian-export处理笔记（保留嵌套结构）
    await exportVault({
        source: notesDir,
        destination: notesDir, // 原地处理（测试阶段简化，直接修改notes目录）
        exclude: [], // 测试阶段不排除文件
        transform: (content, file) => {
            if (file.endsWith('.md')) {
                // 处理双链（[[文件夹/文件名]] → 转换为网页链接）
                let processed = content.replace(/\[\[(.*?)\]\]/g, (_, link) => {
                    const cleanLink = link.replace(/\.md$/, '') // 移除.md后缀
                    // 生成链接路径（适配VitePress路由：/notes/文件夹/文件名.html）
                    return `[${cleanLink}](/pressidian/notes/${cleanLink}.html)`
                })

                // 处理附件（![[assets/图片.png]] → 转换为public路径）
                processed = processed.replace(
                    /!\[\[(assets\/.*?)\]\]/g,
                    (_, asset) => {
                        return `![](/pressidian/${asset})`
                    }
                )

                return processed
            }
            return content
        },
    })

    console.log('笔记处理完成（本地测试模式）')
}

// 执行脚本
processNotes().catch(console.error)

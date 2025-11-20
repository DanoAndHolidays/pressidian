const { exportVault } = require('obsidian-export')
const fs = require('fs-extra')
const path = require('path')

async function process() {
    // 仓库A拉取的原始笔记路径（仓库B中临时目录）
    const rawDir = path.join(__dirname, '../docs/raw-notes')
    // 处理后输出路径（供VitePress使用）
    const outputDir = path.join(__dirname, '../docs/notes')
    // 附件输出路径（public/assets）
    const assetsDir = path.join(__dirname, '../docs/public/assets')

    // 清空旧内容
    await fs.emptyDir(outputDir)
    await fs.emptyDir(assetsDir)

    // 用obsidian-export转换笔记（支持双链、排除冗余文件）
    await exportVault({
        source: rawDir,
        destination: outputDir,
        exclude: ['.obsidian', '.github'], // 排除Obsidian配置
        transform: (content) => {
            // 转换附件路径（适配GitHub Pages）
            return content.replace(
                /!\[\[(assets\/.*?)\]\]/g,
                (_, asset) => `![](/obsidian-web-repo/${asset})` // 仓库B的base路径
            )
        },
    })

    // 同步附件到public/assets
    await fs.copy(path.join(rawDir, 'assets'), assetsDir, { overwrite: true })
}

process().catch(console.error)

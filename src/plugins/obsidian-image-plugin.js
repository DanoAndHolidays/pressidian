import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export default function obsidianImagePlugin(md) {
    // 处理Obsidian图片链接格式: ![[]]
    md.inline.ruler.before('text', 'obsidian_image', (state) => {
        for (let i = 0; i < state.tokens.length; i++) {
            const token = state.tokens[i]
            if (token.type === 'inline') {
                for (let j = 0; j < token.children.length; j++) {
                    const child = token.children[j]
                    if (child.type === 'text') {
                        // 将![[图片名]]转换为![图片名](/notes/attachments/图片名)
                        child.content = child.content.replace(
                            /\!\[\[(.*?)\]\]/g,
                            (match, imageName) => {
                                // 处理可能的文件扩展名
                                const formattedName = imageName.trim()
                                return `![${formattedName}](/notes/attachments/${formattedName})`
                            }
                        )
                    }
                }
            }
        }
    })
}

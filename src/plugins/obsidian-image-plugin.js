function normalizeBase(base = '/') {
    if (!base || base === '/') {
        return '/'
    }

    return `${base.replace(/\/+$/, '')}/`
}

export default function obsidianImagePlugin(md) {
    md.inline.ruler.before('image', 'obsidian_image', (state, silent) => {
        const start = state.pos
        const source = state.src.slice(start)
        const obsidianMatch = source.match(/^!\[\[([^\]]+)\]\]/)

        if (!obsidianMatch) {
            return false
        }

        if (silent) {
            return true
        }

        const base = normalizeBase(md.options.base)

        if (obsidianMatch) {
            const rawImageName = obsidianMatch[1].trim()
            const [fileName] = rawImageName.split('|')
            const imageName = fileName.trim()
            const imageSrc = new URL(
                `notes/attachments/${encodeURI(imageName)}`,
                `http://localhost${base}`,
            ).pathname

            const imageToken = state.push('html_inline', '', 0)
            imageToken.content = `<img src="${imageSrc}" alt="${imageName}">`
            state.pos += obsidianMatch[0].length
            return true
        }
    })
}

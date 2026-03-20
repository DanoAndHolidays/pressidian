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
        const match = source.match(/^!\[\[([^\]]+)\]\]/)

        if (!match) {
            return false
        }

        if (silent) {
            return true
        }

        const rawImageName = match[1].trim()
        const [fileName] = rawImageName.split('|')
        const imageName = fileName.trim()
        const base = normalizeBase(md.options.base)

        const imageToken = state.push('image', 'img', 0)
        const imageSrc = new URL(
            `notes/attachments/${encodeURI(imageName)}`,
            `http://localhost${base}`,
        ).pathname

        imageToken.attrs = [
            ['src', imageSrc],
            ['alt', imageName],
        ]
        imageToken.content = imageName
        imageToken.children = []

        state.pos += match[0].length
        return true
    })
}

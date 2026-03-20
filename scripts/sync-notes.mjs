import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

const NOTES_REPO_URL = 'https://github.com/DanoAndHolidays/ObsidianSave.git'
const NOTES_TARGET_DIR = path.resolve(process.cwd(), 'docs/notes')

async function cloneNotesRepository(tempDir) {
    await execFileAsync('git', [
        'clone',
        '--depth',
        '1',
        NOTES_REPO_URL,
        tempDir,
    ])
}

async function syncNotes() {
    const tempDir = await fs.mkdtemp(
        path.join(os.tmpdir(), 'pressidian-notes-'),
    )

    try {
        console.log(`开始同步笔记: ${NOTES_REPO_URL}`)
        await cloneNotesRepository(tempDir)

        await fs.remove(path.join(tempDir, '.git'))
        await fs.ensureDir(path.dirname(NOTES_TARGET_DIR))
        await fs.emptyDir(NOTES_TARGET_DIR)
        await fs.copy(tempDir, NOTES_TARGET_DIR, {
            filter: (src) => path.basename(src) !== '.git',
        })

        console.log(`笔记同步完成: ${NOTES_TARGET_DIR}`)
    } finally {
        await fs.remove(tempDir)
    }
}

syncNotes().catch((error) => {
    console.error('同步笔记失败')
    console.error(error)
    process.exit(1)
})

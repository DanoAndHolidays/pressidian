# 自动同步配置

Pressidian 支持两种 Obsidian 内容同步方式。同步内容统一写入 `content/notes/obsidian/`。

## 本地同步

```bash
npm run sync:obsidian -- --source "D:/path/to/your/vault"
npm run dev
```

同步脚本会：

1. 复制 Markdown 笔记并保留目录结构。
2. 复制图片等附件，**原样保留 vault 里的相对路径**。
3. 删除上一次由同步脚本写入、但本次已经不存在的文件。

### 同步时不再改写内容

旧的 VuePress 版本会在同步阶段就把 `[[双链]]`、`![[附件]]` 改写成 Markdown 链接，
并转义原始 HTML。现在这些都交给渲染管线处理，理由是：

- 渲染时才能看到**完整的笔记图谱**，双链可以按文件名跨目录解析，而不是只能按相对路径；
- 同步区因此保持为 vault 的忠实镜像，出问题时可以直接和 Obsidian 对比；
- 需要改渲染策略时只改 [`vite/markdown.ts`](../vite/markdown.ts)，不必重新同步。

附件同时会被复制一份到 `public/vault/`，文件名带内容哈希，
这样重新同步后不会命中旧缓存，也不会和上一版的文件名冲突。

## GitHub Actions 定时同步

工作流 [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) 每天北京时间
08:00 运行，也会在 `main` 分支更新时运行，构建结果发布到 `gh-pages` 分支。

流程：

```text
checkout 笔记仓库 → .obsidian-source
npm run sync:obsidian -- --source .obsidian-source
npm run build           # BASE_PATH=/pressidian/
部署 dist/ 到 gh-pages
```

构建分两步产出内容：

- `buildStart`：扫描仓库、建立链接图、复制附件、写 `content/.index.json`
- `buildEnd`：逐篇渲染 Markdown 并写 `public/notes/*.json`

因此 `dist/` 里既有前端资源，也有笔记正文的 JSON 分块，部署时一起发布。

在仓库的 GitHub Settings → Secrets and variables → Actions 中配置：

- Variable `OBSIDIAN_REPOSITORY`：可选，笔记仓库，格式如 `DanoAndHolidays/my-notes`。
  未配置时默认拉取 `DanoAndHolidays/ObsidianSave`。
- Secret `OBSIDIAN_TOKEN`：仅当笔记仓库为私有仓库时需要，令牌需拥有该仓库的只读权限。

如果不配置 `OBSIDIAN_REPOSITORY`，工作流会自动使用现有的公开笔记仓库
`DanoAndHolidays/ObsidianSave`。

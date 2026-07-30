# 自动同步配置

Pressidian 现在支持两种 Obsidian 内容同步方式。同步内容统一写入 `docs/notes/obsidian/`，不会删除 `docs/notes/` 中手工维护的文章。

## 本地同步

```bash
npm run sync:obsidian -- --source "D:/path/to/your/vault"
npm run docs:dev
```

同步脚本会：

1. 复制 Markdown 笔记并保留目录结构。
2. 将 `[[双链]]` 转换为 VuePress 可以识别的 Markdown 链接。
3. 复制 Obsidian 图片附件并转换 `![[图片.png]]` 嵌入语法。
4. 只清理上一次由同步脚本写入、但本次已经不存在的文件。
5. 在构建前自动生成首页与笔记页使用的内容索引。

## GitHub Actions 定时同步

工作流 `.github/workflows/deploy.yml` 每天北京时间 08:00 运行，也会在 `main` 分支更新时运行，并把构建结果发布到现有的 `gh-pages` 分支。

在 Pressidian 仓库的 GitHub Settings → Secrets and variables → Actions 中配置：

- Variable `OBSIDIAN_REPOSITORY`：可选，笔记仓库，格式如 `DanoAndHolidays/my-notes`。未配置时默认拉取 `DanoAndHolidays/ObsidianSave`。
- Secret `OBSIDIAN_TOKEN`：仅当笔记仓库为私有仓库时需要，令牌需拥有该仓库的只读权限。

如果不配置 `OBSIDIAN_REPOSITORY`，工作流会自动使用现有的公开笔记仓库 `DanoAndHolidays/ObsidianSave`。

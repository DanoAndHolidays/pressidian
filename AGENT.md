# Pressidian 维护说明

这份文档写给后续接手这个仓库的人，也写给会继续修改它的 agent。

先说结论：这个项目不是“把 [`docs/notes`](docs/notes) 直接丢给 VitePress 渲染”这么简单。远程 Obsidian 笔记里包含 wiki 链接、附件图片、原始 HTML、以及不一定存在的相对链接。如果直接渲染，构建很容易失败。

## 先理解当前的工作流

当前构建链路不是单步构建，而是这条流水线：

1. 运行 [`scripts/sync-notes.mjs`](scripts/sync-notes.mjs)
2. 把远程仓库同步到 [`docs/notes`](docs/notes)
3. 运行 [`src/process-notes.mjs`](src/process-notes.mjs)
4. 把原始笔记转换到 [`docs/generated-notes`](docs/generated-notes)
5. 运行 [`src/generate-sidebar.mjs`](src/generate-sidebar.mjs)
6. 基于 [`docs/generated-notes`](docs/generated-notes) 生成侧边栏
7. 再执行 [`vitepress build docs`](package.json:13)

对应脚本入口在 [`prepare-notes`](package.json:9)。

## 为什么 [`docs/notes`](docs/notes) 不能直接渲染

最开始的思路是：同步远程仓库到 [`docs/notes`](docs/notes)，然后让 VitePress 直接渲染它。

这个方案在实践里遇到了几个问题：

### 1. Obsidian 图片语法会触发构建问题

远程笔记里有很多类似 [`![[xxx.png]]`](src/process-notes.mjs:27) 的写法，也有标准 Markdown 图片写法。

如果直接保留成 VitePress 能识别的图片资源路径，Vite 在构建时会尝试把这些资源当作模块导入。遇到绝对路径或特殊文件名时，就会出现“Rollup failed to resolve import”的错误。

### 2. 原始 HTML 内容不稳定

部分笔记里混有原始 HTML。VitePress 在解析 Markdown 时会把它们当成可渲染标签，而不是普通文本。这会带来不可控的兼容问题。

### 3. 远程笔记中的链接并不总是完整

有些链接来自 Obsidian 的 wiki link，有些是相对路径，有些本身就是死链。VitePress 默认会在构建阶段检查死链，最后直接导致 build fail。

## 为什么要引入 [`docs/generated-notes`](docs/generated-notes)

[`docs/notes`](docs/notes) 是“原始同步区”。

[`docs/generated-notes`](docs/generated-notes) 是“站点渲染区”。

这两个目录分开后，有几个明显好处：

- 原始笔记保持同步结果，不做人工维护
- 渲染层可以做清洗、转义、兼容处理
- 出问题时更容易定位：是同步问题，还是渲染转换问题
- 不会在构建时反复污染原始笔记内容

如果以后要调整渲染策略，优先改 [`src/process-notes.mjs`](src/process-notes.mjs)，不要直接改远程同步下来的文件。

## 为什么图片最终改成了普通链接

这是这次排障里最关键的结论。

一开始尝试过这些方案：

- 直接保留 Markdown 图片
- 转成 HTML [`<img>`](src/process-notes.mjs:18)
- 通过静态资源复制插件托管附件

这些方案都没有彻底解决构建问题。根因是：**只要 Markdown 里仍然出现会被 VitePress 识别成图片资源的写法，它就可能在构建阶段尝试解析成导入。**

最终稳定方案是：

- 把图片统一转换成普通链接
- 例如输出 [`[查看图片：xxx](...)`](src/process-notes.mjs:19)
- 这样页面里仍能访问附件，但构建阶段不会把它当模块导入

代价是图片不再内嵌展示，而是点击打开。

这不是最漂亮的展示方式，但它是目前最稳、最适合自动化构建的方案。

## 为什么启用 [`ignoreDeadLinks: true`](docs/.vitepress/config.mjs:10)

远程 Obsidian 笔记不是严格受控的文档源，它天然会包含：

- 文件后来被删除的旧链接
- 还没同步过来的相对链接
- 不标准的 wiki link

VitePress 默认把死链当成构建失败条件。对于这个项目，这个默认行为不适合。

这里的目标是“每天自动同步并稳定构建出站点”，而不是“保证所有远程笔记链接都完全正确”。

所以最终选择在 [`docs/.vitepress/config.mjs`](docs/.vitepress/config.mjs) 中启用 [`ignoreDeadLinks: true`](docs/.vitepress/config.mjs:10)。

这意味着：

- 个别笔记里的坏链接不会再阻塞整个站点发布
- 页面仍然能正常生成
- 维护成本显著下降

## 当前必须遵守的维护约定

### 不要提交同步目录

[`docs/notes`](.gitignore:43) 和 [`docs/generated-notes`](.gitignore:44) 都在 [`.gitignore`](.gitignore) 里。

原因：

- [`docs/notes`](docs/notes) 是外部仓库同步产物
- [`docs/generated-notes`](docs/generated-notes) 是构建前的中间产物

这两个目录都不应该成为手工维护内容。

### 不要把笔记重新切回 [`/notes/`](docs/notes)

当前导航和侧边栏都已经切到 [`/generated-notes/`](docs/.vitepress/config.mjs:48)。

如果你把渲染入口重新指向 [`docs/notes`](docs/notes)，之前遇到的构建问题大概率会再次出现。

### 不要轻易恢复图片内嵌渲染

如果后续有人想恢复 `<img>` 或 Markdown 图片，请先确认：

- 构建时 Vite 不会把它们解析成失败的资源导入
- SSR 阶段不会再报附件路径解析错误
- 远程仓库中的所有图片路径都能稳定映射

在没有完整验证前，不要改回去。

## 每天 7 点自动构建的含义

定时任务配置在 [`.github/workflows/dano.yml`](.github/workflows/dano.yml)。

它的职责是：

- 定时执行同步
- 重新生成可渲染笔记目录
- 重新生成侧边栏
- 执行 VitePress 构建

这个设计的重点不是“缓存旧内容”，而是“每次构建都拿最新远程笔记”。

## 遇到问题时怎么查

按这个顺序排查，通常最快。

### 先看同步有没有成功

运行：

```bash
npm run sync-notes
```

确认 [`docs/notes`](docs/notes) 已经被更新。

### 再看渲染目录能不能生成

运行：

```bash
npm run process:notes
```

如果这里失败，重点检查 [`src/process-notes.mjs`](src/process-notes.mjs) 的文本转换逻辑。

### 再看侧边栏是否正常

运行：

```bash
npm run generate:sidebar
```

然后检查 [`docs/.vitepress/sidebar.mjs`](docs/.vitepress/sidebar.mjs) 是否基于 [`docs/generated-notes`](docs/generated-notes) 生成。

### 最后看完整构建

运行：

```bash
npm run docs:build
```

如果失败，优先判断是哪一类：

- 附件资源解析失败
- Markdown 中原始 HTML 导致解析异常
- wiki link 或相对链接导致死链
- 路由入口仍指向旧目录

## 如果以后要优化

最值得继续优化的方向有两个：

1. 在 [`src/process-notes.mjs`](src/process-notes.mjs) 中做更智能的 wiki link 解析
2. 尝试恢复一部分安全的图片内嵌渲染，而不是全部退化成链接

但在做这些优化之前，先保住两件事：

- [`npm run docs:build`](package.json:13) 必须稳定通过
- 每天定时构建不能被单篇笔记内容拖垮

这是当前仓库最重要的维护原则。

# 用 VitePress 同步和发布远程 Obsidian 笔记

这份文档总结的是一个很具体的场景：

- 笔记保存在另一个 Git 仓库
- 站点用 VitePress 构建
- 内容来源是 Obsidian 风格 Markdown
- 希望每次构建都拿到最新笔记，而不是把同步结果长期提交到当前仓库

如果你也在做类似的事，这份文档可以直接复用。

## 先用“两层目录”而不是直接渲染原始笔记

不要把远程同步下来的笔记直接交给 VitePress。

更稳妥的方式是：

- 原始同步目录：[`docs/notes`](docs/notes)
- 渲染输出目录：[`docs/generated-notes`](docs/generated-notes)

这样做的原因很简单：Obsidian 笔记并不是天然适合 VitePress 直接消费的输入格式。

## 为什么直接渲染经常失败

最常见的问题有四类。

### Obsidian wiki link 不是标准 Markdown 链接

例如：

```md
[[路由守卫]]
```

VitePress 不会自动按 Obsidian 的方式解析它。你需要在预处理阶段把它转换成普通 Markdown 链接。

当前项目的处理逻辑在 [`transformWikiLinks()`](src/process-notes.mjs:52)。

### 图片会在构建时被当成资源导入

这类问题最容易让构建直接失败。

常见输入包括：

- [`![[xxx.png]]`](src/process-notes.mjs:27)
- [`![alt](...)`](src/process-notes.mjs:39)
- 原始 HTML 图片标签

如果你输出的是 VitePress 会识别的图片语法，Vite 可能在 build 时尝试解析附件路径，并报资源找不到。

### 原始 HTML 不一定安全

远程笔记里一旦混入原始 HTML，VitePress 可能把它当作真正的模板内容，而不是普通文本。

当前项目采用的策略是对原始 HTML 做统一转义，逻辑在 [`escapeRawHtml()`](src/process-notes.mjs:22)。

### 死链会阻塞构建

远程笔记中的链接很难保证永远有效。

如果 VitePress 仍然使用默认死链检查，构建可能会因为几条旧链接直接失败。

当前项目通过 [`ignoreDeadLinks: true`](docs/.vitepress/config.mjs:10) 解决这个问题。

## 当前项目最终采用的方案

### 1. 同步远程仓库到本地临时目录

运行：

```bash
npm run sync-notes
```

脚本位置是 [`scripts/sync-notes.mjs`](scripts/sync-notes.mjs)。

同步目标目录是 [`docs/notes`](docs/notes)。

## 2. 把原始笔记转换成可渲染内容

运行：

```bash
npm run process:notes
```

脚本位置是 [`src/process-notes.mjs`](src/process-notes.mjs)。

这个步骤会：

- 读取 [`docs/notes`](docs/notes)
- 输出到 [`docs/generated-notes`](docs/generated-notes)
- 处理 wiki link
- 处理 Obsidian 图片语法
- 转义原始 HTML

## 3. 把图片退化成普通链接

这是这次排障里最实用的经验。

如果图片资源路径不稳定，最稳的办法不是继续硬抗，而是把图片统一转换成普通链接，例如：

```md
[查看图片：example.png](/pressidian/notes/attachments/example.png)
```

当前实现位于 [`buildImageLink()`](src/process-notes.mjs:18)。

这样做会损失内嵌展示，但构建成功率会明显提高。

## 4. 侧边栏只基于渲染目录生成

运行：

```bash
npm run generate:sidebar
```

脚本位置是 [`src/generate-sidebar.mjs`](src/generate-sidebar.mjs)。

注意，侧边栏来源必须是 [`docs/generated-notes`](docs/generated-notes)，不要再读原始目录。

## 5. 让 VitePress 渲染新目录

当前入口在 [`docs/.vitepress/config.mjs`](docs/.vitepress/config.mjs)：

- 导航入口指向 [`/generated-notes/`](docs/.vitepress/config.mjs:48)
- 侧边栏根键是 [`/generated-notes/`](src/generate-sidebar.mjs:59)

这一步很重要。如果这里还是旧的 [`/notes/`](docs/notes)，前面的转换工作就白做了。

## 6. 关闭死链阻塞

在这类项目里，死链通常不是阻塞发布的严重错误，而是内容源天然不完美。

所以建议直接配置：

```js
ignoreDeadLinks: true
```

参考当前实现：[`docs/.vitepress/config.mjs`](docs/.vitepress/config.mjs)。

## 推荐的脚本组织方式

把完整构建前置步骤串起来，效果最好。

当前项目使用的是 [`prepare-notes`](package.json:9)：

```json
"prepare-notes": "npm run sync-notes && npm run process:notes && npm run generate:sidebar"
```

然后把 [`docs:dev`](package.json:12) 和 [`docs:build`](package.json:13) 都挂在它后面。

这样无论是本地开发还是 CI 构建，流程都一致。

## 这类目录通常都应该忽略提交

建议忽略两个目录：

- [`docs/notes`](.gitignore:43)
- [`docs/generated-notes`](.gitignore:44)

原因是：

- 一个是外部同步产物
- 一个是构建前中间产物

这两类内容都不适合手工维护。

## 适合定时构建的原因

这个方案很适合配合 GitHub Actions 定时任务。

因为它满足三个条件：

1. 每次构建都能拉取最新远程笔记
2. 构建前有固定的预处理链路
3. 单篇笔记的问题不容易拖垮整个站点

当前仓库的定时任务配置在 [`.github/workflows/dano.yml`](.github/workflows/dano.yml)。

## 推荐的排障顺序

如果后续再遇到问题，按这个顺序排查。

### 同步失败

先运行：

```bash
npm run sync-notes
```

确认远程仓库能成功拉取到 [`docs/notes`](docs/notes)。

### 转换失败

再运行：

```bash
npm run process:notes
```

重点检查 [`src/process-notes.mjs`](src/process-notes.mjs) 的转换逻辑。

### 侧边栏异常

运行：

```bash
npm run generate:sidebar
```

然后检查 [`docs/.vitepress/sidebar.mjs`](docs/.vitepress/sidebar.mjs) 是否正确生成。

### 构建失败

运行：

```bash
npm run docs:build
```

如果失败，通常属于下面几类：

- 附件路径被识别成资源导入
- 原始 HTML 影响 Markdown 解析
- 渲染入口仍然是旧目录
- VitePress 死链检查未关闭

## 什么时候可以重新尝试内嵌图片

只有在你能证明下面三件事时，才建议恢复内嵌图：

1. 所有图片路径都有稳定映射规则
2. Vite 构建不会再把它们解析成失败的导入
3. SSR 和静态构建都能通过

在那之前，普通链接虽然不够漂亮，但更适合生产化自动构建。

## 最后记住一条原则

这类项目最重要的不是“百分之百保留 Obsidian 的展示效果”，而是：

- 每次构建都能拿到最新内容
- 构建链路稳定
- 个别笔记问题不会让整站发布失败

如果你要在“展示完整度”和“自动构建稳定性”之间二选一，优先选后者。

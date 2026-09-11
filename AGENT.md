# Pressidian 维护说明

这份文档写给后续接手这个仓库的人，也写给会继续修改它的 agent。

先说结论：站点在 2.0 版本从 VuePress 迁移到了 **Vite + Vue 3 + TypeScript + Tailwind v4**。
迁移的原因不是"想换框架"，而是旧方案的两处硬约束：

1. VuePress 把 Markdown 编译成 Vue SFC，随手写的 HTML 或未闭合标签会让**整站构建失败**。
2. 主题层被 VuePress 的布局体系限制，无法做首屏 WebGL、逐字动画、命令面板这类交互。

## 现在的构建链路

```text
GitHub Actions
  └─ checkout 笔记仓库到 .obsidian-source
      └─ npm run sync:obsidian -- --source .obsidian-source
          └─ 复制 Markdown + 附件到 content/notes/obsidian/
              └─ npm run build（vite build）
                  ├─ buildStart       扫描仓库、建立链接图、复制附件、写 content/.index.json
                  ├─ buildEnd         逐篇渲染、按体积分块写 public/notes/*.json
                  └─ 输出 dist/
                      └─ 部署 dist/ 到 gh-pages
```

关键点：**笔记正文在构建期渲染成 HTML**，运行时只做一次 `fetch`。
浏览器不需要下载 markdown-it，也不需要下载 Shiki —— 它们只在构建期跑。

## 各层职责

### 同步层：[`scripts/sync-obsidian.mjs`](scripts/sync-obsidian.mjs)

只做复制，不做转换。

旧的同步脚本会把 `[[双链]]`、`![[附件]]` 提前改写成 Markdown 链接、还会转义原始 HTML。
现在不需要了：那些语法由渲染管线在拥有完整笔记图谱的前提下解析，这样
**同步下来的内容始终是仓库的忠实镜像**，出问题时可以直接和 Obsidian 对比。

附件同时复制到 `public/vault/`，文件名带内容哈希，避免重新同步后命中旧缓存。

### 内容层：[`vite/`](vite)

| 文件 | 职责 |
| --- | --- |
| [`vite/vault.ts`](vite/vault.ts) | 扫描仓库、解析 frontmatter、路径与 slug 规范化、附件命名 |
| [`vite/markdown.ts`](vite/markdown.ts) | Obsidian 语法改写、markdown-it 渲染、Shiki 高亮 |
| [`vite/notes-plugin.ts`](vite/notes-plugin.ts) | Vite 插件：元数据虚拟模块、附件同步、渲染器注册表 |
| [`vite/documents.ts`](vite/documents.ts) | 渲染全部笔记并按体积分块发布为 JSON |

元数据通过 `virtual:notes-meta` 以虚拟模块注入，随首屏一起到达，
所以树、标签和搜索是**即时**的，不需要网络请求。

正文则发布成静态 JSON：

```text
public/notes/manifest.json     路由表（约 70 KB）
public/notes/g*.json           按文件夹 + 体积上限分块的正文
```

`content/.index.json` 是同一份图谱的可读快照，方便 diff 和排查，站点不依赖它。

### 应用层：`src/`

- [`src/stores/notes.ts`](src/stores/notes.ts)：元数据、标签统计、目录树、关联、排序、搜索
- [`src/stores/documents.ts`](src/stores/documents.ts)：正文缓存与加载状态
- [`src/lib/notes/loader.ts`](src/lib/notes/loader.ts)：manifest + 分块 JSON 的获取与路由归一化
- [`src/components/ui/`](src/components/ui)：通用组件，按 shadcn-vue 约定一目录一组件

## 必须遵守的约定

### 不要在内容层重复拼接站点 base

`BASE_PATH` 由 Vite 统一注入，构建时的默认值是 `/pressidian/`（见 [`vite.config.ts`](vite.config.ts)）。
渲染管线生成附件 URL 时会拼上这个 base，应用层用 `import.meta.env.BASE_URL`。
**任何地方都不应该硬编码站点路径**。

这条踩过两次：

1. `publishDocuments()` 曾经把 assetBase 写成 `'/vault/'`，
   于是笔记里的图片成了 `/vault/xxx.png`，在 `/pressidian/` 下全部 404。
   现在它接收 `base` 参数，由插件把 `config.base` 传进去。
2. `index.html` 里的 favicon 曾经写成 `/favicon.svg`（绝对路径不经过 base），
   现在用 `%BASE_URL%favicon.svg`。

`npm run build` 之后可以自查：`dist/index.html` 里的资源应该是
`/pressidian/assets/...`，笔记 JSON 里的图片应该是 `/pressidian/vault/...`。

### 路由使用 hash 模式，这是刻意的

见 [`src/router/index.ts`](src/router/index.ts)。

GitHub Pages 是纯静态托管，没有 rewrite 规则，所以 `/pressidian/notes/xxx`
在磁盘上找不到对应文件。

**常见的 `404.html` 兜底方案在这里不成立**：GitHub 会以 404 状态码返回
`404.html`，而浏览器**不会执行 404 响应里的 ES module**，应用根本不会启动。
这个结论是在本地用 [`scripts/serve-pages.mjs`](scripts/serve-pages.mjs)
复现出来的，不是推测。

所以路由改成 `createWebHashHistory`：所有 URL 都命中磁盘上唯一的
`index.html`，路由放在 `#` 后面。代价是分享链接里带 `#`，
换来的是任何静态托管上都能直接打开笔记链接。

如果以后要换回 history 模式，前提是托管平台支持 rewrite
（Netlify 的 `_redirects`、Vercel 的 `rewrites`、或自己的服务器）。

### 发布出来的 JSON 文件名必须带内容哈希

[`vite/documents.ts`](vite/documents.ts) 里的分块文件名形如
`g10-前端-面试.559e3f3f.json`。

GitHub Pages 会给静态文件带缓存头。如果文件名固定，重新部署后
**回访用户会继续读旧笔记**——文件名没变，浏览器直接用缓存。
这和 Vite 给 JS/CSS 加哈希是同一个道理，只是这里是手写的。

`manifest.json` 的名字不能带哈希（阅读器要能找到它），所以它的
URL 会带一个 `?v=<构建时间戳>` 查询参数。这个参数来自
`virtual:notes-meta` 的 `generatedAt`，随 JS bundle 一起更新。

### 本地验证要用带子路径的静态服务器

`vite preview` **不能**验证部署效果：它把 `dist/` 当作 web root，
而线上是 `/pressidian/` 前缀。曾经因为这个盲区，把资源路径错误的
构建推上线过一次。

正确的做法是用 [`scripts/serve-pages.mjs`](scripts/serve-pages.mjs)：

```bash
npm run build
# 模拟 gh-pages 的实际布局：web root 下放一个 pressidian/ 目录
mkdir -p /tmp/pages/pressidian && cp -r dist/* /tmp/pages/pressidian/
node scripts/serve-pages.mjs /tmp/pages 4182
# 打开 http://127.0.0.1:4182/pressidian/
```

它按原样服务给定目录，未命中的路径返回 404，与 GitHub Pages 一致。

### 日期是推断出来的，不是声称的

笔记仓库里**没有 `date:` frontmatter**（587 篇里只有 10 篇有）。

而且 `git clone` 会把所有文件的 mtime 设成检出时间，
所以直接用 mtime 会让 567 篇笔记看起来都写于同一秒。

当前策略（[`inferDate()`](vite/notes-plugin.ts)）按可靠性排序：

1. frontmatter 里的 `updated` / `date` / `created` / `modified`
2. 文件名开头的 `2026-07-30-标题`
3. 正文前 40 行中的日期（跳过 `Last Format Time:` 这类导出元数据行）
4. 全库出现次数最多的日期

**永远不用 mtime**。前端用 `dateSource` 区分，推断出来的日期显示为 `~2026.07.30`。

`8/11/2026` 是歧义的（美式是 8 月 11 日，其他地方是 11 月 8 日），
因此只有"第一个数字 > 12"或"第二个数字 > 12"时才接受，其余一律忽略。

### 成熟度也是推断的

同样没有 `status:` frontmatter。当前用链接图谱推断
（[`deriveStatus()`](vite/notes-plugin.ts)）：

- `evergreen`：出入度 ≥ 5、被引用 ≥ 2 次、正文 ≥ 1200 字
- `growing`：出入度 ≥ 2、正文 ≥ 500 字，且有入链或 ≥ 2 条出链
- `seedling`：其余

如果以后在 Obsidian 里加了 `status:`，显式值会自动优先，不需要改代码。

### 虚拟模块只用来传元数据

**不要把正文放进虚拟模块。**

`import('virtual:xxx')` 的动态导入会被 Rollup 的输出格式包装重写，
具名导出被压缩成 `_` / `g` 这类别名，拿到的可能是 `undefined` 而不是模块命名空间。
这个坑在迁移过程中踩了三次（具名导出、default 导出、命名空间导入都不行）。

正文一律走 `public/` 下的静态 JSON —— 完全在打包器之外，不会被改写。

### 附件命名规则只有一份

[`assetPublicName()`](vite/vault.ts) 同时被同步脚本和渲染管线使用。
如果改了哈希算法或文件名清洗规则，两边会同时改到，否则 `![[图片.png]]` 会指向不存在的文件。

### Tailwind 需要显式排除内容目录

`content/` 和 `public/vault/` 里有几百 MB 的 Markdown 和媒体文件。
[`src/styles/main.css`](src/styles/main.css) 里的 `@source not` 指令把它们排除在
类名扫描之外；删掉这几行会让开发服务器启动和热更新变得非常慢。

### Vite 的 watcher 必须忽略 `public/vault/`

[`vite.config.ts`](vite.config.ts) 里 `server.watch.ignored` 包含 `**/public/vault/**`。
插件在启动时会把附件复制进去，如果 watcher 跟着这些文件走，
复制本身会被当成变更，触发整页重载并陷入循环，开发服务器会直接崩溃。

## 排查顺序

**树或搜索是空的** → 元数据虚拟模块的问题，看 `content/notes/obsidian/` 有没有内容，
再跑 `npm run content:index`。

**笔记打不开 / 提示"暂时无法渲染"** → 打开 Network 面板看 `manifest.json` 和 `g*.json`：
- 404 → `public/notes/` 没生成，检查构建日志里有没有 `[pressidian] public/notes`
- 返回 HTML 而不是 JSON → 请求的文件名不存在，检查 `manifest.json` 里的 `groups`
- 路由对不上 → [`resolveRoute()`](src/lib/notes/loader.ts) 的归一化，
  注意 `routeGroup` 是按**规范路由**索引的，不是按归一化后的 key

**图片不显示** → 检查 `public/vault/` 里有没有对应哈希文件，
再确认 `![[...]]` 解析出的路径是否带上了 `BASE_PATH`。

**代码块没有颜色** → Shiki 在构建期跑。检查 JSON 里有没有 `class="shiki"`；
配色由 [`prose.css`](src/styles/prose.css) 里的 `--shiki-light` / `--shiki-dark` 规则控制。

**构建很慢** → 慢在 `buildEnd` 逐篇渲染，约 600 篇需要 40 秒左右。
日志会每 150 篇打一次进度。这与笔记数量线性相关，属于预期。

## 如果以后要优化

按收益排序：

1. **给笔记加日期和成熟度 frontmatter**，让推断逻辑退居兜底。
2. **正文分块再细一点**：目前单块上限 3 MB，最大的文件夹仍需下载几 MB。
   可以按二级目录再切，或者改用首屏预取。
3. **恢复数学公式**：仓库里有 `$...$` 写法（数学建模笔记），目前不渲染。
   接入 KaTeX 需要在 [`vite/markdown.ts`](vite/markdown.ts) 里加插件，
   并把 KaTeX 的 CSS 一起打包。
4. **双链 hover 预览**：图谱已经有了，缺的是浮层 UI。

但在做这些之前，先保住两件事：

- `npm run build` 必须稳定通过
- 每天定时构建不能被单篇笔记内容拖垮

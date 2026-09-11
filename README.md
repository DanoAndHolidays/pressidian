# Pressidian

Dano 的前端作品集与数字花园：个人主页、项目经历和 Obsidian 技术笔记统一在一个站点里。

线上地址：[https://danoandholidays.github.io/pressidian/](https://danoandholidays.github.io/pressidian/)

## 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | Vue 3（`<script setup>` + TypeScript） |
| 构建 | Vite 7 |
| 样式 | Tailwind CSS v4（`@theme` 令牌 + CSS 变量） |
| 状态 | Pinia |
| 路由 | Vue Router 4 |
| 内容渲染 | markdown-it + Shiki（构建期渲染，输出静态 JSON） |
| 图标 | lucide-vue-next |
| 组件约定 | shadcn-vue 目录结构（`src/components/ui`） |

## 主要能力

- 橙色主题的数字花园首页，WebGL 噪声背景 + 逐字解密标题
- 项目、技能、经历与联系方式
- 自动生成的笔记索引、标签筛选、即时搜索（`⌘K` 命令面板）
- Obsidian `[[双链]]`、`![[附件]]` 与脚注式关联笔记
- 阅读视图：目录树、本页大纲、反向链接、相邻笔记、阅读进度
- 亮色 / 深色主题，跟随系统并可手动切换
- 每天从 `DanoAndHolidays/ObsidianSave` 拉取最新笔记
- GitHub Actions 自动构建并发布到 GitHub Pages

## 本地开发

```bash
npm install
# 可选：把本地 Obsidian 仓库同步进来
npm run sync:obsidian -- --source "D:/path/to/your/vault"
npm run dev
```

首次启动需要扫描并索引整个仓库（约 40 秒 / 600 篇笔记），之后的热更新是即时的。

## 构建

```bash
npm run build      # 输出到 dist/，base 默认 /pressidian/
npm run preview    # 快速本地预览（注意：它把 dist/ 当根，不模拟子路径）
npm run typecheck  # vue-tsc 类型检查
```

要验证接近线上的效果，用 [`scripts/serve-pages.mjs`](scripts/serve-pages.mjs)，
它按 GitHub Pages 的方式服务，见 [AGENT.md](./AGENT.md#本地验证要用带子路径的静态服务器)。

## 路由说明

站点使用 **hash 路由**（URL 形如 `/pressidian/#/notes/xxx`）。

GitHub Pages 没有 rewrite 规则，而常见的 `404.html` 兜底方案在这里行不通：
浏览器不会执行 404 响应里的 ES module，应用无法启动。
hash 路由让所有地址都命中磁盘上唯一的 `index.html`，笔记链接因此可以直接分享和刷新。

要换回普通路径（history）模式，需要托管平台支持 rewrite，
相关说明写在 [`src/router/index.ts`](src/router/index.ts)。

## 目录结构

```text
content/notes/obsidian/   同步进来的笔记（.gitignore）
public/notes/             构建期生成的笔记 JSON（.gitignore）
public/vault/             构建期复制的附件（.gitignore）
src/components/ui/        通用组件，含 decrypt-text / velaris
src/components/notes/     笔记相关组件
src/components/shell/     页头、页脚、命令面板
src/pages/                路由页面
src/stores/               Pinia store
src/styles/               设计令牌与正文排版
vite/                     内容管线（扫描、渲染、发布）
```

外部 Vault 与自动部署配置见 [AUTOMATION.md](./AUTOMATION.md)；
架构决策与维护约定见 [AGENT.md](./AGENT.md)。

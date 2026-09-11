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
npm run build      # 输出到 dist/
npm run preview    # 本地预览构建结果
npm run typecheck  # vue-tsc 类型检查
```

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

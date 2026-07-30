# Pressidian

Dano 的前端作品集与数字花园，将个人主页、项目经历和 Obsidian 技术笔记统一在一个站点中。

线上地址：[https://danoandholidays.github.io/pressidian/](https://danoandholidays.github.io/pressidian/)

## 主要能力

- 橙色狐狸数字花园首页
- 项目、技能、经历与联系方式
- 自动生成的笔记索引、标签筛选和搜索
- Obsidian `[[双链]]` 与 `![[附件]]` 转换
- 每天从 `DanoAndHolidays/ObsidianSave` 拉取最新笔记
- GitHub Actions 自动构建并发布到 GitHub Pages

## 本地开发

```bash
npm install
npm run docs:dev
```

## 构建

```bash
npm run docs:build
```

外部 Vault 与自动部署配置见 [AUTOMATION.md](./AUTOMATION.md)。

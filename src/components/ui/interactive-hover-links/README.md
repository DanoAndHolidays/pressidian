# InteractiveHoverLinks

参考 React `interactive-hover-links` 改写的 Vue 3 导航，入口为
`InteractiveHoverLinks.vue`，单行交互在 `InteractiveHoverLink.vue`。

项目已配置 TypeScript、Tailwind v4 和 shadcn-vue 的 `@/components/ui`
别名（见根目录 `components.json`），全局主题在 `src/styles/main.css`。
组件放在独立 UI 目录，供导航与演示复用；无需重新初始化 shadcn 或安装 React。
图标使用已有的 `lucide-vue-next`，动画使用 CSS 过渡与 Vue 指针事件，
不依赖 React hooks、`motion/react` 或额外的 context provider。

```vue
<script setup lang="ts">
import InteractiveHoverLinks from '@/components/ui/interactive-hover-links/InteractiveHoverLinks.vue'
import { NAV_HOVER_LINKS } from '@/data/site'
</script>

<template>
  <InteractiveHoverLinks :links="NAV_HOVER_LINKS" />
</template>
```

`links` 为 `{ heading, subheading, imgSrc, href }[]`；`href` 使用 Vue Router
内部路径，保留站点的 hash 路由和部署 base。`navigate` 只在普通点击时发出，
修饰键点击保留浏览器打开新标签页的行为。外层控制展开状态，组件只负责链接。

导航内容及 Unsplash 预览图在 `src/data/site.ts` 配置。图片为装饰内容，
加载失败时隐藏，文字链接继续可用。触屏和窄屏隐藏图片并常显箭头；
系统开启减少动态效果时停用图片和逐字位移动画。

`AppHeader.vue` 用原生 modal dialog 承载导航，提供焦点约束、Esc 关闭和
关闭后焦点恢复，并与命令面板共享滚动锁。

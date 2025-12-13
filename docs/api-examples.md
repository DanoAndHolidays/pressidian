---
outline: deep
---

# Runtime API Examples

This page demonstrates usage of some of the runtime APIs provided by VitePress.

The main `useData()` API can be used to access site, theme, and page data for the current page. It works in both `.md` and `.vue` files:

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data
<pre>{{ theme }}</pre>

### Page Data
<pre>{{ page }}</pre>

### Page Frontmatter
<pre>{{ frontmatter }}</pre>
```

```vue
<script setup>
import { useData } from 'vitepress'
// 获取站点、主题、页面和 frontmatter 数据
const { site, theme, page, frontmatter } = useData()

## Results
```
### Theme Data
<pre>{{ site }}</pre>

### Page Data
<pre>{{ theme }}</pre>

### Page Frontmatter
<pre>{{ page }}</pre>
<pre>{{ frontmatter }}</pre>
## More
## 更多 API
Check out the documentation for the [full list of runtime APIs](https://vitepress.dev/reference/runtime-api#usedata).
查看[完整 API 参考](https://vitepress.dev/reference/runtime-api)了解所有可用运行时 API。

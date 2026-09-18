# Bend card

折页卡片：一张 300×300 的方块，悬停时长到 420，把下半张「露」出来。
只有卡片高度在动——照片保持 255px、纸面保持原来的偏移，所以展开是**露出**
下半部分，而不是把内容往下推。

```vue
<BendCard
  to="/notes?status=evergreen"
  :image="plate"
  title="常青笔记"
  small="3 篇"
  tone="jade"
>
  槽位内容在悬停展开时浮现
</BendCard>
```

| Prop | Default | Notes |
| --- | --- | --- |
| `image` | `''` | 折页上方的图，接受任意 CSS `background-image` 值。空值时不画图，只留纸面。 |
| `img` | `''` | 组件库自己的 prop 名，和 `image` 等价；照抄 dano-ui 的示例可以直接用。 |
| `title` | `Vue 卡片组件` | 纸面上的主标题，单行省略。 |
| `small` | `5 hours ago` | 主标题下面的小字。 |
| `tone` | `ember` | `ember` / `jade` / `amber`，只用于键盘聚焦时的描边颜色。 |
| `to` | — | 有值时整张卡渲染成 `RouterLink`，否则是 `div`。 |

## 和组件库的关系

这份实现直接对齐 [dano-ui](https://github.com/DanoAndHolidays/dano-ui)
的单组件包（`VueComponent/dano-ui/src/components/BendCard.vue`），
几何、模糊值、缓动都照搬，**不是**重新演绎：

**折角是纸面右上角的那块 `::after`。** 一个 80×80 的透明方块，靠
`box-shadow: 70px 75px 0 40px <纸面色>` 把纸面色抬到右上：向下 75px、外扩 40px
让阴影顶边比纸面高 45px，向右 70px 让它咬进卡片约 50px，
再和纸面自己的 40px 圆角接在一起，形成右高左低的一条曲线。
阴影就是纸面本身，所以两段圆弧之间不会出现接缝。

**照片和纸面在静止时是虚的。** 照片 `blur(20px)`、纸面 `blur(15px)`，卡片本身还有
`blur(0.2px)`；悬停时三者一起归零，折角从一团白光收成一条清晰的边。

**展开有舞台。** 组件库的 `.container`（固定 420px、内容垂直居中）也一并搬了过来，
卡片从 300 长到 420 是在舞台内部发生的，悬停时页面不会被推开或抖动。

> 这一版之前把折角改写成了一条横贯整张卡的 SVG 弧线，形态和组件库对不上；
> 现在回到 `::after` + `box-shadow` 的原始画法。

## 站点适配

- `to`：站内需要整卡跳转，组件库原本没有这个能力。
- `image` / `img`：`img` 是组件库的 prop 名，`image` 是站内调用用的别名。
- 纸面与文字取自主题令牌（`--paper` / `--ink` / `--faint` / `--muted`）。
  组件库硬编码 `#fff`，在深色主题下会变成白纸白字。
- 深色主题单独调了投影（0.1 → 0.45），否则 10% 的黑影在深色面板上看不见。
- `@media (hover: none)` 与 `prefers-reduced-motion: reduce` 下直接呈现展开态，
  触摸设备不会因为没有 `:hover` 而永远停在合上的样子。

## 尺寸

默认值就是组件库的数值，需要改尺寸时覆盖这几个自定义属性即可，
折角的画法不用动：

| 变量 | 默认 |
| --- | --- |
| `--bc-w` | `300px` |
| `--bc-h` | `300px` |
| `--bc-h-open` | `420px` |
| `--bc-photo-h` | `255px` |
| `--bc-radius` | `40px` |

纸面 `top` 由 `--bc-photo-h` 推出（照片底边再往上 36px），标题、小字、正文
分别再接 +6 / +49 / +81px。所以改照片高度时，折页整体会跟着走。

## 用在哪

- `HomePage.vue` —— 三张笔记成熟度卡片，各自深链到 `/notes?status=<key>`，
  `NotesIndexPage.vue` 会把这个查询参数写进 store 的 `statusFilter`。
- `BendCard.demo.vue` —— 狐狸实验室里的「折页卡片」展示。

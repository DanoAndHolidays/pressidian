import type { NoteStatus } from '@/lib/notes/types'
import type { InteractiveHoverLink } from '@/components/ui/interactive-hover-links/types'

/**
 * Site-owned content: everything that is not generated from the Obsidian vault.
 * Keeping it in one typed module means the pages stay presentational.
 */

export interface Project {
  id: string
  index: string
  focus: string
  title: string
  tagline: string
  description: string
  tech: string[]
  demo: string
  code: string
  /** Accent used by the project card's decorative art. */
  accent: string
  /** Short metrics shown along the card footer. */
  facts: Array<{ label: string; value: string }>
}

export interface SkillGroup {
  title: string
  caption: string
  skills: string[]
}

export interface TimelineEntry {
  period: string
  title: string
  place: string
  description: string
  kind: 'work' | 'open-source' | 'education' | 'award'
}

export interface ContactLink {
  label: string
  value: string
  href: string
}

export const PROJECTS: Project[] = [
  {
    id: 'yike',
    index: '01',
    focus: '交互与性能',
    title: '一刻短剧 Yike',
    tagline: '把滑动这件事做到没有延迟',
    description:
      '高仿抖音的短剧 SPA。复刻核心交互，并在性能优化、数据架构与工程化上深入实践；采用“播一预一”机制，让每一次上滑都落在已经准备好的那一帧上。',
    tech: ['Vue 3', 'Vite', 'Pinia', 'Sass', 'Express'],
    demo: 'https://danoandholidays.github.io/yike/',
    code: 'https://github.com/DanoAndHolidays/yike',
    accent: '#f0642f',
    facts: [
      { label: '机制', value: '播一预一' },
      { label: '首帧', value: '< 100ms' },
    ],
  },
  {
    id: 'test',
    index: '02',
    focus: '数据与可视化',
    title: '深岩智测',
    tagline: '把模型输出翻译成人能读懂的界面',
    description:
      '基于多维信息感知的煤岩损伤演化预警平台。将模型预测结果封装成易于理解的数据可视化界面，让预警不只是数字，而是一条可以追踪的演化曲线。',
    tech: ['Vue 3', 'Vue Router', 'Pinia', 'TailwindCSS', 'ECharts'],
    demo: 'https://danoandholidays.github.io/test/#/',
    code: 'https://github.com/DanoAndHolidays/test',
    accent: '#c88a2e',
    facts: [
      { label: '图表', value: 'ECharts' },
      { label: '场景', value: '损伤预警' },
    ],
  },
  {
    id: 'playlet',
    index: '03',
    focus: '移动端实验',
    title: 'PLAYLET-APP',
    tagline: '一次关于竖屏播放的早期探索',
    description:
      '早期短剧应用原型，专注移动端竖屏播放体验的二次开发与交互探索。很多在一刻里被验证过的判断，最早都是在这个原型里试出来的。',
    tech: ['JavaScript', 'HTML5', 'CSS3'],
    demo: 'https://danoandholidays.github.io/PLAYLET-APP/',
    code: 'https://github.com/DanoAndHolidays/PLAYLET-APP',
    accent: '#3f7d5f',
    facts: [
      { label: '形态', value: '移动端 H5' },
      { label: '定位', value: '交互原型' },
    ],
  },
]

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: '框架与核心',
    caption: '把语言和运行时用扎实',
    skills: ['Vue 3 / Next.js', 'TypeScript', 'Pinia / 状态管理', 'ES6+ / 浏览器渲染'],
  },
  {
    title: '工程与 UI',
    caption: '让项目跑得稳也长得大',
    skills: ['Vite / Rolldown', 'TailwindCSS', 'Sass / SCSS', 'Framer Motion'],
  },
  {
    title: '可视化与动画',
    caption: '把数据讲成一段叙事',
    skills: ['ECharts', 'GSAP / Motion', 'HTML5 Canvas', 'Element Plus'],
  },
]

export const TIMELINE: TimelineEntry[] = [
  {
    period: '2025.10 — 至今',
    title: '前端开发实习生',
    place: '字节跳动',
    description: '负责字节云基础通用业务组件的开发，把重复的界面工作收敛成可复用的组件与规范。',
    kind: 'work',
  },
  {
    period: '2024 — 至今',
    title: '开源贡献者',
    place: 'Vite DevTools',
    description: '参与维护与开发，测试构建产物、发现并修复问题，跟着工具链一起理解 Vite 的内部结构。',
    kind: 'open-source',
  },
  {
    period: '2023 — 2027',
    title: '计算机科学与技术 · 本科',
    place: '中国矿业大学',
    description: '曾获中国青年科技创新“揭榜挂帅”擂台赛国一、数学建模等奖项。',
    kind: 'education',
  },
]

export const AWARDS = [
  '中国青年科技创新“揭榜挂帅”擂台赛 · 国家级一等奖',
  '全国大学生数学建模竞赛 · 获奖',
  '智能车竞赛 · 参与并完成平台前端',
]

export const CONTACTS: ContactLink[] = [
  { label: 'MAIL', value: 'Danoday@Foxmail.com', href: 'mailto:Danoday@Foxmail.com' },
  { label: 'GITHUB', value: '@DanoAndHolidays', href: 'https://github.com/DanoAndHolidays' },
  { label: 'BILIBILI', value: 'DanoDay 主页', href: 'https://space.bilibili.com/111616585' },
]

export const PROFILE = {
  name: 'Dano',
  role: '前端开发者',
  city: '上海',
  eyebrow: 'DANO · FRONTEND ENGINEER · DIGITAL GARDENER',
  headline: '让作品与想法，一起生长。',
  intro:
    '我是 Dano，一名前端开发者。这里统一收录我的项目、经历和持续修剪的技术笔记；狐狸会守着这座花园，提醒我保持好奇。',
  currently: '字节跳动 · 前端开发实习生',
  openSource: 'Vite DevTools · 贡献者',
  education: '中国矿业大学 · 计算机科学与技术',
}

export const STATUS_META: Record<
  NoteStatus,
  { label: string; icon: string; hint: string; tone: string }
> = {
  evergreen: {
    label: '常青笔记',
    icon: '🌿',
    hint: '经过反复整理',
    tone: 'jade',
  },
  growing: {
    label: '生长中',
    icon: '🌾',
    hint: '正在持续补充',
    tone: 'amber',
  },
  seedling: {
    label: '幼苗',
    icon: '🌱',
    hint: '刚刚记下的想法',
    tone: 'ember',
  },
}

/** Primary navigation. `key` doubles as the active-route match. */
export const NAV_ITEMS = [
  { key: 'home', label: '花园入口', to: '/', hint: '回到入口' },
  { key: 'notes', label: '知识笔记', to: '/notes', hint: '在笔记库里检索' },
  { key: 'projects', label: '项目路径', to: '/projects', hint: '做过的东西' },
  { key: 'about', label: '关于 Dano', to: '/about', hint: '经历与技能' },
  { key: 'lab', label: '狐狸实验室', to: '/lab', hint: '还没命名的小实验' },
] as const

/** Preview photography belongs to the navigation, not the reusable UI component. */
const NAV_PREVIEW_IMAGES: Record<(typeof NAV_ITEMS)[number]['key'], string> = {
  home: 'photo-1441974231531-c6227db76b6e',
  notes: 'photo-1507842217343-583bb7270b66',
  projects: 'photo-1498050108023-c5249f4df085',
  about: 'photo-1470770841072-f978cf4d019e',
  lab: 'photo-1464822759023-fed622ff2c3b',
}

export const NAV_HOVER_LINKS: InteractiveHoverLink[] = NAV_ITEMS.map((item) => ({
  heading: item.label,
  subheading: item.hint,
  href: item.to,
  imgSrc: `https://images.unsplash.com/${NAV_PREVIEW_IMAGES[item.key]}?auto=format&fit=crop&w=640&q=80`,
}))

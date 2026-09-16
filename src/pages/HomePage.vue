<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  FlaskConical,
  Github,
  Sparkles,
} from 'lucide-vue-next'
import FoxMark from '@/components/shell/FoxMark.vue'
import NoteStatusBadge from '@/components/notes/NoteStatusBadge.vue'
import PixelPlanet from '@/components/ui/pixel-planet/PixelPlanet.vue'
import { NAV_ITEMS, PROFILE, PROJECTS, STATUS_META } from '@/data/site'
import { useNotesStore } from '@/stores/notes'
import { formatDate, relativeTime } from '@/lib/format'

const notes = useNotesStore()

const latest = computed(() => notes.notes[0])
const recent = computed(() => notes.notes.slice(0, 5))

const statusList = computed(() =>
  (Object.keys(STATUS_META) as Array<keyof typeof STATUS_META>).map((key) => ({
    key,
    ...STATUS_META[key],
    count: notes.stats.statusCount[key],
  })),
)

// Primary destinations share one evenly divided grid.
const mapNodes = [
  { key: 'notes', cjk: '知识笔记', value: () => `${notes.stats.total}`, to: '/notes', icon: BookOpen },
  { key: 'projects', cjk: '项目路径', value: () => `${PROJECTS.length}`, to: '/projects', icon: Compass },
  { key: 'lab', cjk: '狐狸实验室', value: () => 'LAB', to: '/lab', icon: FlaskConical },
  { key: 'github', cjk: '开源足迹', value: () => 'OSS', to: 'https://github.com/DanoAndHolidays', icon: Github },
] as const
</script>

<template>
  <div class="home-page relative">
    <section class="home-hero shell-wide" aria-labelledby="home-title">
      <div class="hero-rail">
        <span class="hero-kicker"><i aria-hidden="true" />DANO’S DIGITAL GARDEN</span>
        <span class="hero-rail-note">记录、创造，保持好奇。</span>
      </div>

      <div class="hero-copy">
        <h1 id="home-title">
          <span>让作品与想法，</span>
          <span class="hero-title-secondary">一起生长<span class="hero-period">。</span></span>
        </h1>
        <p class="hero-intro">我是 {{ PROFILE.name }}，一名前端开发者。<br class="sm:hidden" />在这里写代码，也照料想法。<br class="hidden sm:block" />我的项目、经历与持续更新的技术笔记，都在这座数字花园里。</p>
        <div class="hero-actions">
          <RouterLink to="/notes" class="hero-button hero-button-primary group">
            进入知识花园
            <ArrowRight :size="16" class="transition-transform group-hover:translate-x-1" />
          </RouterLink>
          <RouterLink to="/about" class="hero-button hero-button-secondary group">
            从这里认识我
            <ArrowUpRight :size="16" class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </RouterLink>
        </div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <PixelPlanet />
      </div>

      <div class="hero-overview">
        <RouterLink v-if="latest" :to="latest.path" class="latest-note group">
          <div class="overview-label">
            <span>最新笔记 <span class="overview-english">LATEST NOTE</span></span>
            <ArrowUpRight :size="17" class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <h2>{{ latest.title }}</h2>
          <p class="latest-description line-clamp-2">{{ latest.description }}</p>
          <div class="latest-meta">
            <time :datetime="latest.date">{{ formatDate(latest.date) }}</time>
            <span>{{ latest.readingTime }} 分钟阅读</span>
            <span class="truncate">{{ latest.tags.slice(0, 2).join(' / ') }}</span>
          </div>
        </RouterLink>
        <nav class="hero-shortcuts" aria-label="探索花园">
          <component
            :is="node.to.startsWith('http') ? 'a' : RouterLink"
            v-for="node in mapNodes"
            :key="node.key"
            :to="node.to.startsWith('http') ? undefined : node.to"
            :href="node.to.startsWith('http') ? node.to : undefined"
            :target="node.to.startsWith('http') ? '_blank' : undefined"
            :rel="node.to.startsWith('http') ? 'noreferrer' : undefined"
            class="hero-shortcut group"
          >
            <div class="shortcut-heading">
              <component :is="node.icon" :size="16" :stroke-width="1.5" />
              <ArrowUpRight :size="14" class="shortcut-arrow transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div class="shortcut-caption">
              <span>{{ node.cjk }}</span>
              <span class="shortcut-value">{{ node.value() }}</span>
            </div>
          </component>
        </nav>
      </div>
    </section>

    <!-- ================= RECENT NOTES ================= -->
    <section class="shell-wide pt-20">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="eyebrow">Recently tendered</p>
          <h2 class="mt-3 font-serif text-[clamp(1.9rem,4vw,2.8rem)] leading-tight tracking-[-0.04em]">
            最近打理的笔记
          </h2>
        </div>
        <RouterLink
          to="/notes"
          class="group inline-flex items-center gap-2 text-[0.82rem] text-ember"
        >
          查看全部 {{ notes.stats.total }} 篇
          <ArrowRight :size="14" class="transition-transform group-hover:translate-x-1" />
        </RouterLink>
      </header>

      <div class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <RouterLink
          v-for="(note, index) in recent"
          :key="note.path"
          v-reveal="index * 70"
          :to="note.path"
          class="group relative flex min-h-[15rem] flex-col overflow-hidden rounded-[8px] border border-line bg-paper p-6 transition-[border-color,box-shadow] duration-500 hover:border-ember/45 hover:shadow-[var(--shadow-md)]"

        >

          <div class="flex items-center justify-between gap-3">
            <NoteStatusBadge :status="note.status" />
            <span class="font-mono text-[0.7rem] text-faint">{{ relativeTime(note.date) }}</span>
          </div>

          <h3
            class="mt-5 font-serif text-[1.32rem] leading-snug tracking-[-0.02em] transition-colors duration-300 group-hover:text-ember"
          >
            {{ note.title }}
          </h3>
          <p class="mt-2.5 line-clamp-2 text-[0.82rem] leading-relaxed text-muted">
            {{ note.description }}
          </p>

          <div class="mt-auto flex items-center justify-between pt-5 font-mono text-[0.7rem] text-faint">
            <span class="truncate">{{ note.tags.slice(0, 2).join(' / ') }}</span>
            <span class="flex shrink-0 items-center gap-2">
              {{ note.readingTime }} MIN
              <ArrowUpRight
                :size="13"
                class="text-ember transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </RouterLink>

        <RouterLink
          to="/notes"
          v-reveal="recent.length * 70"
          class="group flex min-h-[15rem] flex-col items-start justify-between rounded-[8px] border border-dashed border-line-strong/70 bg-transparent p-6 transition-colors duration-500 hover:border-ember/60"
        >
          <FoxMark :size="34" class="opacity-80" />
          <div>
            <h3 class="font-serif text-[1.32rem] leading-snug">下一篇笔记<br />会在这里发芽</h3>
            <p class="mt-2 text-[0.82rem] text-muted">
              同步新的 Obsidian 笔记后，这块空地会自动长出内容。
            </p>
          </div>
          <span class="font-mono text-[0.7rem] tracking-[0.14em] text-faint uppercase">
            等待栽种 →
          </span>
        </RouterLink>
      </div>
    </section>

    <!-- ================= KNOWLEDGE SPREAD ================= -->
    <section class="shell-wide pt-20">
      <div
        v-reveal
        class="grid gap-8 rounded-[8px] border border-line bg-paper-2/70 p-6 sm:p-9 lg:grid-cols-[1fr_1.25fr]"
      >
        <div>
          <p class="eyebrow">Growth stages</p>
          <h2 class="mt-3 font-serif text-[clamp(1.7rem,3.4vw,2.4rem)] leading-tight tracking-[-0.04em]">
            笔记不是归档，<br />而是正在生长的路径。
          </h2>
          <p class="mt-4 max-w-md text-[0.86rem] leading-relaxed text-muted">
            每篇笔记都带着成熟度标签与关联关系。你可以按主题筛选，也可以顺着双链一路读下去。
          </p>
          <RouterLink
            to="/notes"
            class="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-[0.8rem] transition-colors hover:border-ember/50 hover:text-ember"
          >
            <Sparkles :size="14" class="text-ember" />
            打开笔记库索引
          </RouterLink>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <div
            v-for="stage in statusList"
            :key="stage.key"
            class="flex flex-col justify-between rounded-[8px] border border-line bg-paper p-4"
          >
            <div>
              <span class="text-2xl" aria-hidden="true">{{ stage.icon }}</span>
              <p class="mt-3 font-serif text-lg leading-none">{{ stage.label }}</p>
              <p class="mt-1.5 text-[0.72rem] text-muted">{{ stage.hint }}</p>
            </div>
            <p
              class="mt-6 font-mono text-[1.6rem] leading-none"
              :style="{ color: `var(--${stage.tone})` }"
            >
              {{ stage.count }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= PROJECTS ================= -->
    <section class="shell-wide pt-20">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="eyebrow">Selected work</p>
          <h2 class="mt-3 font-serif text-[clamp(1.9rem,4vw,2.8rem)] leading-tight tracking-[-0.04em]">
            从花园里长出的项目
          </h2>
        </div>
        <RouterLink to="/projects" class="group inline-flex items-center gap-2 text-[0.82rem] text-ember">
          全部项目
          <ArrowRight :size="14" class="transition-transform group-hover:translate-x-1" />
        </RouterLink>
      </header>

      <div class="mt-8 grid gap-6 lg:grid-cols-3">
        <a
          v-for="(project, index) in PROJECTS"
          :key="project.id"
          v-reveal="index * 90"
          :href="project.demo"
          target="_blank"
          rel="noreferrer"
          class="group relative flex min-h-[17rem] flex-col overflow-hidden rounded-[8px] border border-line bg-paper p-6 transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1.5 hover:border-ember/45 hover:shadow-[var(--shadow-md)]"

        >

          <div class="relative flex items-start justify-between gap-3">
            <span class="font-mono text-[0.7rem] tracking-[0.13em] text-ember">
              {{ project.index }} · {{ project.focus }}
            </span>
            <ArrowUpRight
              :size="16"
              class="text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember"
            />
          </div>

          <h3 class="relative mt-8 font-serif text-2xl tracking-[-0.03em]">{{ project.title }}</h3>
          <p class="relative mt-1 text-[0.74rem] text-ember/85">{{ project.tagline }}</p>
          <p class="relative mt-3 line-clamp-3 text-[0.82rem] leading-relaxed text-muted">
            {{ project.description }}
          </p>

          <div class="relative mt-auto flex flex-wrap items-center gap-1.5 pt-5">
            <span
              v-for="tech in project.tech.slice(0, 3)"
              :key="tech"
              class="rounded-full border border-line px-2 py-0.5 font-mono text-[0.7rem] text-faint"
            >
              {{ tech }}
            </span>
          </div>
        </a>
      </div>
    </section>

    <!-- ================= PROFILE STRIP ================= -->
    <section class="shell-wide pt-20">
      <div
        v-reveal
        class="grid divide-line overflow-hidden rounded-[8px] border border-line bg-paper sm:grid-cols-2 lg:grid-cols-4 lg:divide-x"
      >
        <div v-for="item in [
          { label: 'Currently', value: PROFILE.currently },
          { label: 'Open source', value: PROFILE.openSource },
          { label: 'Education', value: PROFILE.education },
        ]" :key="item.label" class="px-5 py-5">
          <p class="font-mono text-[0.7rem] tracking-[0.14em] text-ember uppercase">
            {{ item.label }}
          </p>
          <p class="mt-2 font-serif text-[1.05rem] leading-snug">{{ item.value }}</p>
        </div>
        <RouterLink
          to="/about"
          class="group flex items-center justify-between gap-3 border-t border-line px-5 py-5 transition-colors hover:bg-ember/8 lg:border-t-0"
        >
          <span class="font-serif text-[1.05rem]">完整经历</span>
          <ArrowUpRight
            :size="16"
            class="text-ember transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </RouterLink>
      </div>
    </section>

    <!-- ================= QUICK NAV ================= -->
    <section class="shell-wide pt-16">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="(item, index) in NAV_ITEMS.slice(1)"
          :key="item.key"
          v-reveal="index * 70"
          :to="item.to"
          class="group flex items-center justify-between gap-4 rounded-[8px] border border-line bg-paper px-4 py-3.5 transition-all duration-500 hover:-translate-y-1 hover:border-ember/45"
        >
          <span>
            <span class="block text-[0.9rem] transition-colors group-hover:text-ember">
              {{ item.label }}
            </span>
            <span class="block font-mono text-[0.7rem] tracking-[0.12em] text-faint uppercase">
              {{ item.hint }}
            </span>
          </span>
          <ArrowRight
            :size="15"
            class="text-faint transition-all duration-500 group-hover:translate-x-1 group-hover:text-ember"
          />
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page h2, .home-page h3 { font-family: var(--font-sans); }
.home-hero { padding-top: 38px; padding-bottom: 72px; border-bottom: 1px solid var(--line); }
.hero-rail { grid-area: rail; display: flex; align-items: center; justify-content: space-between; gap: 20px; color: var(--muted); font-size: 12px; }
.hero-kicker { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 11px; letter-spacing: .14em; }
.hero-kicker i { width: 6px; height: 6px; border-radius: 50%; background: var(--ember); }
.hero-rail-note { letter-spacing: .08em; }
.hero-copy { grid-area: copy; padding-block: clamp(64px, 8vh, 100px) 64px; }
.hero-visual { grid-area: visual; align-self: center; width: 100%; max-width: 680px; }
.home-hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, .78fr); grid-template-areas: "rail rail" "copy visual" "overview overview"; column-gap: clamp(32px, 5vw, 88px); }
.hero-overview { grid-area: overview; }
.hero-copy h1 { margin: 0; font-family: var(--font-sans); font-size: clamp(44px, 5.6vw, 80px); font-weight: 500; line-height: 1.22; letter-spacing: -.055em; }
.hero-copy h1 > span { display: block; }
.hero-title-secondary { color: var(--ink-soft); }
.hero-period { color: var(--ember); }
.hero-intro { margin-top: 26px; max-width: 650px; color: var(--muted); font-size: 15px; line-height: 1.9; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
.hero-button { display: inline-flex; min-height: 46px; align-items: center; justify-content: center; gap: 22px; padding: 11px 20px; border: 1px solid transparent; border-radius: 6px; font-size: 13px; font-weight: 500; transition: background .2s, border-color .2s; }
.hero-button-primary { background: var(--ember-soft); color: var(--on-accent); box-shadow: 0 3px 12px rgb(182 83 32 / .1); }
.hero-button-primary:hover { background: color-mix(in srgb, var(--ember-soft) 85%, #fff); }
.hero-button-secondary { border-color: var(--line); color: var(--ink-soft); }
.hero-button-secondary:hover { background: var(--paper-2); border-color: var(--line-strong); }
.hero-overview { display: grid; grid-template-columns: 1.15fr 1fr; gap: 24px; }
.latest-note, .hero-shortcuts { border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: var(--paper); }
.latest-note { display: flex; min-width: 0; flex-direction: column; padding: 24px; transition: border-color .2s, background .2s; }
.latest-note:hover { border-color: var(--line-strong); background: var(--paper-2); }
.overview-label { display: flex; align-items: center; justify-content: space-between; gap: 16px; color: var(--muted); font-size: 12px; }
.overview-english { margin-left: 12px; color: var(--faint); font-family: var(--font-mono); font-size: 10px; letter-spacing: .08em; }
.latest-note h2 { margin-top: 20px; font-family: var(--font-sans); font-size: 19px; font-weight: 500; letter-spacing: -.02em; }
.latest-description { margin-top: 8px; color: var(--muted); font-size: 13px; line-height: 1.8; }
.latest-meta { display: flex; align-items: center; gap: 16px; margin-top: auto; padding-top: 20px; color: var(--faint); font-size: 11px; }
.latest-meta > :first-child, .latest-meta > :nth-child(2) { flex-shrink: 0; }
.hero-shortcuts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.hero-shortcut { display: flex; min-width: 0; flex-direction: column; justify-content: space-between; gap: 20px; padding: 24px; transition: background .2s; }
.hero-shortcut:hover { background: var(--paper-2); }
.hero-shortcut:nth-child(odd) { border-right: 1px solid var(--line); }
.hero-shortcut:nth-child(-n+2) { border-bottom: 1px solid var(--line); }
.shortcut-heading, .shortcut-caption { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.shortcut-heading { color: var(--muted); }
.shortcut-arrow { color: var(--faint); }
.shortcut-caption { font-size: 13px; }
.shortcut-value { font-family: var(--font-mono); color: var(--muted); font-size: 12px; }
@media (min-width: 1600px) { .hero-copy { padding-block: 104px 80px; } }
@media (max-width: 767px) {
  .home-hero { padding-top: 28px; padding-bottom: 48px; grid-template-columns: 1fr; grid-template-areas: "rail" "copy" "visual" "overview"; column-gap: 0; }
  .hero-rail-note { display: none; }
  .hero-copy { padding-block: 56px 40px; }
  .hero-visual { width: 100%; margin-bottom: 32px; }
  .hero-copy h1 { font-size: clamp(36px, 7.8vw, 56px); }
  .hero-intro { font-size: 14px; margin-top: 24px; }
  .hero-overview { grid-template-columns: 1fr; gap: 16px; }
  .latest-note, .hero-shortcut { padding: 20px; }
  .hero-button { padding-inline: 16px; gap: 14px; }
  .latest-meta { gap: 12px; }
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

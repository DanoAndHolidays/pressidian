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
import Velaris from '@/components/ui/velaris/Velaris.vue'
import DecryptText from '@/components/ui/decrypt-text/DecryptText.vue'
import FoxMark from '@/components/shell/FoxMark.vue'
import NoteStatusBadge from '@/components/notes/NoteStatusBadge.vue'
import { NAV_ITEMS, PROFILE, PROJECTS, STATUS_META } from '@/data/site'
import { useNotesStore } from '@/stores/notes'
import { compactNumber, formatDate, relativeTime } from '@/lib/format'
import { useSpotlight } from '@/composables/useInteractions'

const notes = useNotesStore()
const { onPointerMove } = useSpotlight()

/**
 * Hero palette, per theme.
 *
 * The light stops are deliberate: a pale palette plus the shader's centre glow
 * (which the original hard-codes at 0.3) blows the middle out to near-white and
 * flattens the headline. These sit lower and warmer, and `glow`/`vignette` are
 * turned down so the amplitude stays controlled.
 */
const HERO_BG: [string, string] = ['#f1e4d2', '#15170f']
const HERO_COLORS: [string[], string[]] = [
  ['#eda06a', '#d1774a', '#b05f38', '#f1e4d2'],
  ['#f0642f', '#b84924', '#7a2f16', '#1b1d17'],
]
const HERO_GLOW: [number, number] = [0.1, 0.3]
const HERO_VIGNETTE: [number, number] = [0.34, 0.8]

const latest = computed(() => notes.notes[0])
const recent = computed(() => notes.notes.slice(0, 5))

const statusList = computed(() =>
  (Object.keys(STATUS_META) as Array<keyof typeof STATUS_META>).map((key) => ({
    key,
    ...STATUS_META[key],
    count: notes.stats.statusCount[key],
  })),
)

const mapNodes = [
  { key: 'notes', label: '知识笔记', value: () => `${notes.stats.total}`, to: '/notes', icon: BookOpen },
  { key: 'projects', label: '项目路径', value: () => `${PROJECTS.length}`, to: '/projects', icon: Compass },
  { key: 'lab', label: '狐狸实验室', value: () => 'LAB', to: '/lab', icon: FlaskConical },
  { key: 'github', label: '开源足迹', value: () => 'OSS', to: 'https://github.com/DanoAndHolidays', icon: Github },
] as const
</script>

<template>
  <div class="relative">
    <!-- ================= HERO ================= -->
    <!--
      Full-bleed: no radius, no border, no gutter. The section owns the whole
      viewport under the fixed header so the backdrop reads as the page rather
      than as a card floating on it.
    -->
    <section>
      <Velaris
        :colors="HERO_COLORS"
        :bg="HERO_BG"
        :glow="HERO_GLOW"
        :vignette="HERO_VIGNETTE"
        :speed="1.25"
        :grain="0.34"
        height="auto"
        class="min-h-[calc(100svh-68px)]"
      >
        <div
          class="relative mx-auto flex min-h-[calc(100svh-68px)] w-full max-w-[94rem] flex-col justify-between px-5 pt-10 pb-8 sm:px-8 lg:px-12"
        >
          <!-- top rail -->
          <div class="flex flex-wrap items-center justify-between gap-4">
            <span
              class="inline-flex items-center gap-2.5 rounded-full border border-hero-line bg-hero-surface px-3.5 py-1.5 font-mono text-[0.6rem] tracking-[0.18em] text-hero-muted uppercase backdrop-blur"
            >
              <i
                class="size-1.5 rounded-full bg-ember [animation:pulse-dot_2.4s_ease-out_infinite]"
                aria-hidden="true"
              />
              vault online · {{ notes.stats.total }} notes indexed
            </span>
            <span
              class="hidden font-mono text-[0.6rem] tracking-[0.2em] text-hero-muted uppercase sm:block"
            >
              WebGL · simplex noise · {{ notes.stats.links }} links mapped
            </span>
          </div>

          <!-- headline -->
          <div class="max-w-4xl py-8">
            <DecryptText
              as="h1"
              :text="PROFILE.headline"
              trigger="mount"
              :stagger="46"
              :start-delay="420"
              :loop="false"
              class="!text-hero-fg"
            />

            <p
              class="animate-rise mt-7 max-w-2xl text-[0.95rem] leading-relaxed text-hero-muted"
              style="--reveal-delay: 620ms"
            >
              {{ PROFILE.intro }}
            </p>

            <div class="animate-rise mt-9 flex flex-wrap items-center gap-4" style="--reveal-delay: 780ms">
              <RouterLink
                to="/notes"
                class="group inline-flex items-center gap-2.5 rounded-full bg-ember px-5 py-3 text-[0.84rem] font-semibold text-[#1b1206] shadow-[var(--shadow-ember)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-ember-soft"
              >
                进入知识花园
                <ArrowRight :size="15" class="transition-transform duration-500 group-hover:translate-x-1" />
              </RouterLink>
              <RouterLink
                to="/about"
                class="group inline-flex items-center gap-2 border-b border-hero-line pb-1 text-[0.84rem] text-hero-fg transition-colors hover:border-ember hover:text-ember"
              >
                从这里认识我
                <ArrowUpRight :size="14" class="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </RouterLink>
            </div>
          </div>

          <!-- hero footer: latest note + map -->
          <div class="grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:items-end">
            <RouterLink
              v-if="latest"
              :to="latest.path"
              class="group relative overflow-hidden rounded-2xl border border-hero-line bg-hero-surface p-5 backdrop-blur-md transition-colors duration-500 hover:border-ember/45 hover:bg-hero-surface-strong"
            >
              <div class="flex items-center justify-between gap-3">
                <span class="font-mono text-[0.58rem] tracking-[0.18em] text-ember uppercase">
                  latest planting
                </span>
                <span class="font-mono text-[0.58rem] text-hero-muted">
                  {{ relativeTime(latest.date) }}
                </span>
              </div>
              <h2 class="mt-3 font-serif text-xl leading-snug text-hero-fg">
                {{ latest.title }}
              </h2>
              <p class="mt-1.5 line-clamp-2 text-[0.8rem] leading-relaxed text-hero-muted">
                {{ latest.description }}
              </p>
              <div class="mt-3 flex items-center gap-3 font-mono text-[0.6rem] text-hero-muted">
                <span>{{ formatDate(latest.date) }}</span>
                <span class="size-1 rounded-full bg-hero-line" />
                <span>{{ latest.readingTime }} 分钟</span>
                <span class="size-1 rounded-full bg-hero-line" />
                <span>{{ latest.tags.slice(0, 2).join(' / ') }}</span>
              </div>
              <span
                class="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-hero-surface-strong to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:[animation:sheen_1.1s_ease-out]"
                aria-hidden="true"
              />
            </RouterLink>

            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <component
                :is="node.to.startsWith('http') ? 'a' : RouterLink"
                v-for="node in mapNodes"
                :key="node.key"
                :to="node.to.startsWith('http') ? undefined : node.to"
                :href="node.to.startsWith('http') ? node.to : undefined"
                :target="node.to.startsWith('http') ? '_blank' : undefined"
                :rel="node.to.startsWith('http') ? 'noreferrer' : undefined"
                class="group rounded-xl border border-hero-line bg-hero-surface p-3.5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-ember/45"
              >
                <component :is="node.icon" :size="15" class="text-ember" />
                <p class="mt-2.5 font-serif text-lg leading-none text-hero-fg">{{ node.value() }}</p>
                <p class="mt-1 font-mono text-[0.56rem] tracking-[0.12em] text-hero-muted uppercase">
                  {{ node.label }}
                </p>
              </component>
            </div>
          </div>
        </div>
      </Velaris>
    </section>

    <!-- ================= TELEMETRY ================= -->
    <section class="shell-wide">
      <div
        v-reveal
        class="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
      >
        <div
          v-for="stat in [
            { label: '公开笔记', value: `${notes.stats.total}`, hint: `${notes.stats.folders} 个路径` },
            { label: '累计阅读', value: formatDate(notes.stats.latest), hint: '最近一次栽种' },
            { label: '知识总量', value: `${compactNumber(notes.stats.weight)}`, hint: '字符与词' },
            { label: '双向关联', value: `${notes.stats.links}`, hint: 'wiki 链接' },
          ]"
          :key="stat.label"
          class="group bg-paper px-5 py-4 transition-colors duration-500 hover:bg-paper-2"
        >
          <p class="font-mono text-[0.58rem] tracking-[0.18em] text-faint uppercase">
            {{ stat.label }}
          </p>
          <p class="mt-2 font-serif text-2xl tracking-[-0.03em] transition-colors group-hover:text-ember">
            {{ stat.value }}
          </p>
          <p class="mt-0.5 text-[0.7rem] text-muted">{{ stat.hint }}</p>
        </div>
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

      <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <RouterLink
          v-for="(note, index) in recent"
          :key="note.path"
          v-reveal="index * 70"
          :to="note.path"
          class="spotlight group relative flex min-h-[15rem] flex-col overflow-hidden rounded-2xl border border-line bg-paper p-5 transition-[border-color,box-shadow] duration-500 hover:border-ember/45 hover:shadow-[var(--shadow-md)]"
          @pointermove="onPointerMove"
        >
          <span
            class="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-ember to-transparent transition-transform duration-700 group-hover:scale-x-100"
            aria-hidden="true"
          />

          <div class="flex items-center justify-between gap-3">
            <NoteStatusBadge :status="note.status" />
            <span class="font-mono text-[0.58rem] text-faint">{{ relativeTime(note.date) }}</span>
          </div>

          <h3
            class="mt-5 font-serif text-[1.32rem] leading-snug tracking-[-0.02em] transition-colors duration-300 group-hover:text-ember"
          >
            {{ note.title }}
          </h3>
          <p class="mt-2.5 line-clamp-2 text-[0.82rem] leading-relaxed text-muted">
            {{ note.description }}
          </p>

          <div class="mt-auto flex items-center justify-between pt-5 font-mono text-[0.6rem] text-faint">
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
          class="group flex min-h-[15rem] flex-col items-start justify-between rounded-2xl border border-dashed border-line-strong/70 bg-transparent p-5 transition-colors duration-500 hover:border-ember/60"
        >
          <FoxMark :size="34" class="opacity-80" />
          <div>
            <h3 class="font-serif text-[1.32rem] leading-snug">下一篇笔记<br />会在这里发芽</h3>
            <p class="mt-2 text-[0.82rem] text-muted">
              同步新的 Obsidian 笔记后，这块空地会自动长出内容。
            </p>
          </div>
          <span class="font-mono text-[0.6rem] tracking-[0.14em] text-faint uppercase">
            等待栽种 →
          </span>
        </RouterLink>
      </div>
    </section>

    <!-- ================= KNOWLEDGE SPREAD ================= -->
    <section class="shell-wide pt-20">
      <div
        v-reveal
        class="grid gap-8 rounded-[1.75rem] border border-line bg-paper-2/70 p-6 sm:p-9 lg:grid-cols-[1fr_1.25fr]"
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
            class="flex flex-col justify-between rounded-xl border border-line bg-paper p-4"
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

      <div class="mt-8 grid gap-4 lg:grid-cols-3">
        <a
          v-for="(project, index) in PROJECTS"
          :key="project.id"
          v-reveal="index * 90"
          :href="project.demo"
          target="_blank"
          rel="noreferrer"
          class="spotlight group relative flex min-h-[17rem] flex-col overflow-hidden rounded-2xl border border-line bg-paper p-5 transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1.5 hover:border-ember/45 hover:shadow-[var(--shadow-md)]"
          @pointermove="onPointerMove"
        >
          <div
            class="absolute -top-16 -right-16 size-40 rounded-full opacity-[0.14] blur-2xl transition-opacity duration-700 group-hover:opacity-30"
            :style="{ background: project.accent }"
            aria-hidden="true"
          />

          <div class="relative flex items-start justify-between gap-3">
            <span class="font-mono text-[0.6rem] tracking-[0.16em] text-ember">
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
              class="rounded-full border border-line px-2 py-0.5 font-mono text-[0.58rem] text-faint"
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
        class="grid divide-line overflow-hidden rounded-2xl border border-line bg-paper sm:grid-cols-2 lg:grid-cols-4 lg:divide-x"
      >
        <div v-for="item in [
          { label: 'Currently', value: PROFILE.currently },
          { label: 'Open source', value: PROFILE.openSource },
          { label: 'Education', value: PROFILE.education },
        ]" :key="item.label" class="px-5 py-5">
          <p class="font-mono text-[0.58rem] tracking-[0.18em] text-ember uppercase">
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
          class="group flex items-center justify-between gap-4 rounded-xl border border-line bg-paper px-4 py-3.5 transition-all duration-500 hover:-translate-y-1 hover:border-ember/45"
        >
          <span>
            <span class="block text-[0.9rem] transition-colors group-hover:text-ember">
              {{ item.label }}
            </span>
            <span class="block font-mono text-[0.58rem] tracking-[0.12em] text-faint uppercase">
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

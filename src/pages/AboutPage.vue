<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, Award, GraduationCap, Mail, Sparkles } from 'lucide-vue-next'
import FoxMark from '@/components/shell/FoxMark.vue'
import Velaris from '@/components/ui/velaris/Velaris.vue'
import { AWARDS, CONTACTS, PROFILE, SKILL_GROUPS, TIMELINE } from '@/data/site'
import { useNotesStore } from '@/stores/notes'
import { compactNumber } from '@/lib/format'

const notes = useNotesStore()

const ABOUT_BG: [string, string] = ['#f0e3d1', '#141510']
const ABOUT_COLORS: [string[], string[]] = [
  ['#e79a63', '#cd7448', '#a95a35', '#f0e3d1'],
  ['#f0642f', '#8c3a1c', '#4a2413', '#141510'],
]
const ABOUT_GLOW: [number, number] = [0.12, 0.3]
const ABOUT_VIGNETTE: [number, number] = [0.3, 0.8]

const kindMeta = {
  work: { label: 'Experience', tone: 'var(--ember)' },
  'open-source': { label: 'Open source', tone: 'var(--jade)' },
  education: { label: 'Education', tone: 'var(--amber)' },
  award: { label: 'Award', tone: 'var(--ember)' },
} as const

const facts = computed(() => [
  { label: 'Currently', value: PROFILE.currently },
  { label: 'Based in', value: `${PROFILE.city} · CN` },
  { label: 'Notes published', value: `${notes.stats.total} 篇` },
  { label: 'Knowledge weight', value: `${compactNumber(notes.stats.weight)} 字` },
])
</script>

<template>
  <div class="shell-wide pt-6">
    <!-- ============ HERO ============ -->
    <Velaris
      :colors="ABOUT_COLORS"
      :bg="ABOUT_BG"
      :glow="ABOUT_GLOW"
      :vignette="ABOUT_VIGNETTE"
      :speed="1"
      :grain="0.3"
      height="auto"
      class="min-h-[24rem] rounded-[2rem] border border-hero-line"
    >
      <div class="grid min-h-[24rem] items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1.4fr_auto]">
        <div>
          <p class="font-mono text-[0.7rem] tracking-[0.2em] text-ember uppercase">About Dano</p>
          <h1
            class="mt-4 font-serif text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.08] tracking-[-0.05em] text-hero-fg"
          >
            写代码，做产品，<br />
            也整理一路上的判断。
          </h1>
          <p class="mt-5 max-w-xl text-[0.9rem] leading-relaxed text-hero-muted">
            Crafting high-performance, immersive digital experiences where code meets art.
            我把做过的事、踩过的坑和想清楚的问题，都留在这座花园里。
          </p>
        </div>

        <div class="flex items-center gap-6">
          <FoxMark :size="120" variant="portrait" class="drop-shadow-[0_20px_50px_rgba(0,0,0,0.28)]" />
        </div>
      </div>
    </Velaris>

    <!-- ============ FACTS ============ -->
    <section v-reveal class="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="fact in facts" :key="fact.label" class="bg-paper px-5 py-4">
        <p class="font-mono text-[0.72rem] tracking-[0.14em] text-faint uppercase">{{ fact.label }}</p>
        <p class="mt-2 font-serif text-[1.1rem] leading-snug">{{ fact.value }}</p>
      </div>
    </section>

    <!-- ============ TIMELINE ============ -->
    <section class="pt-16">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="eyebrow">Experience / Education</p>
          <h2 class="mt-3 font-serif text-[clamp(1.8rem,3.8vw,2.6rem)] tracking-[-0.04em]">
            时间线上的一些节点
          </h2>
        </div>
        <p class="font-mono text-[0.7rem] text-faint">
          {{ TIMELINE.length }} 段经历
        </p>
      </header>

      <ol class="relative mt-9 border-l border-line pl-0">
        <li
          v-for="(entry, index) in TIMELINE"
          :key="entry.title"
          v-reveal="index * 90"
          class="relative grid gap-3 pb-10 pl-8 last:pb-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8"
        >
          <span
            class="absolute top-2 -left-[5px] size-2.5 rounded-full border-2 border-canvas"
            :style="{ background: kindMeta[entry.kind].tone }"
            aria-hidden="true"
          />

          <div class="pt-1">
            <p class="font-mono text-[0.72rem] tracking-[0.06em] text-faint">{{ entry.period }}</p>
            <p
              class="mt-1 font-mono text-[0.7rem] tracking-[0.14em] uppercase"
              :style="{ color: kindMeta[entry.kind].tone }"
            >
              {{ kindMeta[entry.kind].label }}
            </p>
          </div>

          <div class="group rounded-2xl border border-line bg-paper p-5 transition-all duration-500 hover:-translate-y-1 hover:border-ember/45 hover:shadow-[var(--shadow-sm)]">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <h3 class="font-serif text-[1.3rem] tracking-[-0.03em]">{{ entry.title }}</h3>
              <span class="text-[0.8rem] text-ember">{{ entry.place }}</span>
            </div>
            <p class="mt-2.5 text-[0.86rem] leading-relaxed text-muted">{{ entry.description }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- ============ SKILLS ============ -->
    <section class="pt-16">
      <header>
        <p class="eyebrow">Toolbox</p>
        <h2 class="mt-3 font-serif text-[clamp(1.8rem,3.8vw,2.6rem)] tracking-[-0.04em]">
          顺手和不顺手的工具
        </h2>
      </header>

      <div class="mt-8 grid gap-4 lg:grid-cols-3">
        <article
          v-for="(group, index) in SKILL_GROUPS"
          :key="group.title"
          v-reveal="index * 90"
          class="rounded-2xl border border-line bg-paper p-5 transition-all duration-500 hover:-translate-y-1 hover:border-ember/45"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-serif text-[1.2rem] tracking-[-0.03em]">{{ group.title }}</h3>
              <p class="mt-1 text-[0.76rem] text-muted">{{ group.caption }}</p>
            </div>
            <Sparkles :size="15" class="mt-1 shrink-0 text-ember" />
          </div>

          <ul class="mt-5">
            <li
              v-for="skill in group.skills"
              :key="skill"
              class="flex items-center gap-3 border-t border-line py-2.5 text-[0.84rem] text-ink-soft"
            >
              <span class="size-1 shrink-0 rounded-full bg-ember/70" aria-hidden="true" />
              {{ skill }}
            </li>
          </ul>
        </article>
      </div>
    </section>

    <!-- ============ AWARDS ============ -->
    <section class="pt-16">
      <div v-reveal class="grid gap-8 rounded-[1.75rem] border border-line bg-paper-2/70 p-7 sm:p-9 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p class="eyebrow flex items-center gap-2">
            <Award :size="13" /> Selected honours
          </p>
          <h2 class="mt-3 font-serif text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight tracking-[-0.04em]">
            竞赛与奖项
          </h2>
          <p class="mt-3 text-[0.86rem] leading-relaxed text-muted">
            这些经历大多不是纯前端的，但它们训练了我把复杂问题拆开、再用工程手段收敛的能力。
          </p>
          <p class="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-2 text-[0.78rem]">
            <GraduationCap :size="14" class="text-ember" />
            中国矿业大学 · 计算机科学与技术
          </p>
        </div>

        <ul class="grid content-start gap-3">
          <li
            v-for="award in AWARDS"
            :key="award"
            class="flex items-start gap-3 rounded-xl border border-line bg-paper px-4 py-3.5 text-[0.86rem] transition-colors hover:border-ember/45"
          >
            <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
            {{ award }}
          </li>
        </ul>
      </div>
    </section>

    <!-- ============ CONTACT ============ -->
    <section class="pt-16 pb-4">
      <header>
        <p class="eyebrow flex items-center gap-2">
          <Mail :size="13" /> Get in touch
        </p>
        <h2 class="mt-3 font-serif text-[clamp(1.8rem,3.8vw,2.6rem)] tracking-[-0.04em]">
          想聊聊，随时找我
        </h2>
      </header>

      <div class="mt-8 grid gap-3 sm:grid-cols-3">
        <a
          v-for="(contact, index) in CONTACTS"
          :key="contact.label"
          v-reveal="index * 80"
          :href="contact.href"
          target="_blank"
          rel="noreferrer"
          class="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-paper px-5 py-4 transition-all duration-500 hover:-translate-y-1 hover:border-ember/45"
        >
          <span>
            <span class="block font-mono text-[0.7rem] tracking-[0.13em] text-faint uppercase">
              {{ contact.label }}
            </span>
            <span class="mt-1 block font-serif text-[1.05rem] transition-colors group-hover:text-ember">
              {{ contact.value }}
            </span>
          </span>
          <ArrowUpRight
            :size="16"
            class="shrink-0 text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember"
          />
        </a>
      </div>
    </section>
  </div>
</template>

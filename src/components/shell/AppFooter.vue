<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, Github, Mail, Rss } from 'lucide-vue-next'
import FoxMark from './FoxMark.vue'
import DanoLogo from './DanoLogo.vue'
import { CONTACTS, NAV_ITEMS, PROFILE } from '@/data/site'
import { useNotesStore } from '@/stores/notes'
import { compactNumber } from '@/lib/format'

const notes = useNotesStore()
const year = new Date().getFullYear()

const syncLabel = computed(() => {
  const value = notes.syncedAt
  if (!value) return '等待同步'
  const date = new Date(value)
  return `${date.getFullYear()}.${`${date.getMonth() + 1}`.padStart(2, '0')}.${`${date.getDate()}`.padStart(2, '0')}`
})

const marquee = computed(() => [
  `${notes.stats.total} 篇笔记`,
  'Obsidian 双链',
  `${compactNumber(notes.stats.weight)} 字`,
  'WebGL 背景',
  'Tailwind v4',
  'Vue 3 + TypeScript',
  '每天 08:00 自动同步',
  '数字花园',
])
</script>

<template>
  <footer class="relative mt-24 overflow-hidden border-t border-line bg-paper-2/60">
    <!-- Marquee: a quiet reminder that the garden is alive. -->
    <div class="flex overflow-hidden border-b border-line py-3 select-none">
      <div class="marquee-track flex shrink-0 items-center gap-8 pr-8">
        <template v-for="pass in 2" :key="pass">
          <span
            v-for="item in marquee"
            :key="`${pass}-${item}`"
            class="flex shrink-0 items-center gap-8 font-mono text-[0.7rem] tracking-[0.2em] text-faint uppercase"
          >
            {{ item }}
            <i class="size-1 rounded-full bg-ember/60" aria-hidden="true" />
          </span>
        </template>
      </div>
    </div>

    <div class="shell grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        <div class="flex items-center gap-3">
          <FoxMark :size="34" />
          <span class="font-serif text-2xl tracking-[-0.04em]">Pressidian</span>
        </div>
        <p class="mt-4 max-w-md text-[0.86rem] leading-relaxed text-muted">
          在上海写代码，也照料想法。项目、经历与 Obsidian 笔记在同一个站点里持续生长，
          每天自动同步一次。
        </p>
        <div class="mt-4 flex items-center gap-3">
          <span class="font-mono text-[0.65rem] tracking-[0.12em] text-muted uppercase">Made by</span>
          <DanoLogo class="w-28" />
        </div>
        <div
          class="mt-5 inline-flex items-center gap-2.5 rounded-full border border-line bg-paper px-3 py-1.5"
        >
          <i
            class="size-1.5 rounded-full bg-ember [animation:pulse-dot_2.4s_ease-out_infinite]"
            aria-hidden="true"
          />
          <span class="font-mono text-[0.7rem] tracking-[0.12em] text-muted uppercase">
            vault synced · {{ syncLabel }}
          </span>
        </div>
      </div>

      <nav aria-label="页脚导航">
        <p class="eyebrow">Explore</p>
        <ul class="mt-4 grid gap-2.5">
          <li v-for="item in NAV_ITEMS" :key="item.key">
            <RouterLink
              :to="item.to"
              class="group inline-flex items-center gap-1.5 text-[0.86rem] text-ink-soft transition-colors hover:text-ember"
            >
              {{ item.label }}
              <ArrowUpRight
                :size="12"
                class="opacity-0 transition-opacity group-hover:opacity-100"
              />
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div>
        <p class="eyebrow">Elsewhere</p>
        <ul class="mt-4 grid gap-2.5">
          <li v-for="contact in CONTACTS" :key="contact.label">
            <a
              :href="contact.href"
              target="_blank"
              rel="noreferrer"
              class="group flex items-baseline justify-between gap-3 border-b border-line pb-2 text-[0.86rem] transition-colors hover:border-ember/50 hover:text-ember"
            >
              <span class="font-mono text-[0.7rem] tracking-[0.14em] text-faint uppercase">
                {{ contact.label }}
              </span>
              <span class="text-ink-soft group-hover:text-ember">{{ contact.value }}</span>
            </a>
          </li>
        </ul>

        <div class="mt-6 flex gap-2">
          <a
            href="https://github.com/DanoAndHolidays"
            target="_blank"
            rel="noreferrer"
            class="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-ember/50 hover:text-ember"
            aria-label="GitHub"
          >
            <Github :size="15" />
          </a>
          <a
            href="mailto:Danoday@Foxmail.com"
            class="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-ember/50 hover:text-ember"
            aria-label="Email"
          >
            <Mail :size="15" />
          </a>
          <RouterLink
            to="/notes"
            class="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-ember/50 hover:text-ember"
            aria-label="笔记索引"
          >
            <Rss :size="15" />
          </RouterLink>
        </div>
      </div>
    </div>

    <div
      class="shell flex flex-col gap-2 border-t border-line py-6 font-mono text-[0.7rem] text-faint sm:flex-row sm:items-center sm:justify-between"
    >
      <span>© {{ year }} {{ PROFILE.name }} & Fox · 用 Vue 3 与 Tailwind 重建</span>
      <span class="tracking-[0.12em] uppercase">{{ PROFILE.city }} · CN</span>
    </div>
  </footer>
</template>

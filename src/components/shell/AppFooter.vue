<script setup lang="ts">
/**
 * The site footer: `FooterSection5` fed with this garden's own navigation.
 *
 * Every link here already exists elsewhere in the app — the columns are the
 * header's routes, the three maturity deep links the homepage cards use, and the
 * contact rows from `CONTACTS`. Nothing in the footer is a placeholder.
 */
import { computed } from 'vue'
import { ArrowUp, Clapperboard, Github, Mail, Rss } from 'lucide-vue-next'
import DanoWordmark from './DanoWordmark.vue'
import FooterSection5 from '@/components/ui/footer-section-5/FooterSection5.vue'
import type { FooterColumn } from '@/components/ui/footer-section-5/types'
import { CONTACTS, NAV_ITEMS, PROFILE, STATUS_META } from '@/data/site'
import { useNotesStore } from '@/stores/notes'

const notes = useNotesStore()

const columns = computed<FooterColumn[]>(() => [
  {
    title: '探索',
    links: NAV_ITEMS.map((item) => ({ name: item.label, to: item.to })),
  },
  {
    /*
     * The same `?status=` deep links the homepage cards use, with counts read
     * from the store — so the footer doubles as a small index of the vault.
     */
    title: '笔记索引',
    links: [
      {
        name: STATUS_META.evergreen.label,
        to: '/notes?status=evergreen',
        note: `${notes.stats.statusCount.evergreen}`,
      },
      {
        name: STATUS_META.growing.label,
        to: '/notes?status=growing',
        note: `${notes.stats.statusCount.growing}`,
      },
      {
        name: STATUS_META.seedling.label,
        to: '/notes?status=seedling',
        note: `${notes.stats.statusCount.seedling}`,
      },
      { name: '全部笔记', to: '/notes', note: `${notes.stats.total}` },
    ],
  },
  {
    title: '联络',
    links: CONTACTS.map((contact) => ({
      name: contact.label,
      href: contact.href,
      note: contact.value,
    })),
  },
])

/**
 * `scroll-behavior` is already `smooth` on `html` and the global reduced-motion
 * rule resets it to `auto`, so a plain scroll hands both behaviours to CSS.
 */
const toTop = () => window.scrollTo({ top: 0 })
</script>

<template>
  <div class="mt-24">
    <FooterSection5
      brand="PRESSIDIAN"
      :headline="PROFILE.headline"
      caption="在上海写代码，也照料想法。项目、经历与 Obsidian 笔记在同一个站点里持续生长。"
      :columns="columns"
    >
      <template #logo>
        <DanoWordmark class="w-[104px] text-ember" />
      </template>

      <template #social>
        <a
          href="https://github.com/DanoAndHolidays"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <Github :size="15" />
        </a>
        <a href="mailto:Danoday@Foxmail.com" aria-label="邮件">
          <Mail :size="15" />
        </a>
        <a
          href="https://space.bilibili.com/111616585"
          target="_blank"
          rel="noreferrer"
          aria-label="Bilibili 主页"
        >
          <Clapperboard :size="15" />
        </a>
        <RouterLink to="/notes" aria-label="笔记索引">
          <Rss :size="15" />
        </RouterLink>
        <button type="button" aria-label="回到顶部" @click="toTop">
          <ArrowUp :size="15" />
        </button>
      </template>
    </FooterSection5>
  </div>
</template>

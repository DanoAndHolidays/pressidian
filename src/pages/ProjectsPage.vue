<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpRight, ExternalLink, Github } from 'lucide-vue-next'
import { PROJECTS } from '@/data/site'
import { useSpotlight } from '@/composables/useInteractions'
import { cn } from '@/lib/utils'

const { onPointerMove } = useSpotlight()

const FILTERS = ['全部', ...new Set(PROJECTS.map((project) => project.focus))]
const active = ref('全部')

const visible = computed(() =>
  active.value === '全部' ? PROJECTS : PROJECTS.filter((project) => project.focus === active.value),
)
</script>

<template>
  <div class="shell-wide pt-14">
    <header class="border-b border-line pb-10">
      <p class="eyebrow">Selected work</p>
      <h1 class="mt-4 font-serif text-[clamp(2.3rem,6vw,4.6rem)] leading-[1] tracking-[-0.055em]">
        在真实问题里，<br />
        <span class="text-gradient-ember italic">把想法做出来。</span>
      </h1>
      <div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.8rem] text-muted">
        <span class="font-mono text-[0.72rem] tracking-[0.12em] uppercase">
          {{ PROJECTS.length }} 个已发布项目
        </span>
        <span class="hidden h-3 w-px bg-line sm:block" />
        <span>Vue · TypeScript · 数据可视化</span>
        <a
          href="https://github.com/DanoAndHolidays"
          target="_blank"
          rel="noreferrer"
          class="ml-auto inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-ember"
        >
          <Github :size="14" />
          去 GitHub 看看
          <ArrowUpRight :size="13" />
        </a>
      </div>

      <div class="mt-8 flex flex-wrap gap-2">
        <button
          v-for="filter in FILTERS"
          :key="filter"
          type="button"
          :class="
            cn(
              'rounded-full border px-3.5 py-1.5 text-[0.76rem] transition-colors duration-300',
              active === filter
                ? 'border-ember bg-ember/12 text-ember'
                : 'border-line text-muted hover:border-ember/40 hover:text-ink',
            )
          "
          @click="active = filter"
        >
          {{ filter }}
        </button>
      </div>
    </header>

    <section class="grid gap-px border-b border-line">
      <article
        v-for="(project, index) in visible"
        :key="project.id"
        v-reveal="index * 90"
        class="spotlight group relative grid gap-6 border-b border-line py-10 transition-colors duration-500 last:border-b-0 lg:grid-cols-[5rem_minmax(0,1fr)_12rem] lg:gap-10"
        @pointermove="onPointerMove"
      >
        <!-- index rail -->
        <div class="flex items-start gap-4 lg:flex-col lg:gap-3">
          <span class="font-mono text-[0.8rem] text-ember">{{ project.index }}</span>
          <span
            class="mt-2 hidden h-px w-8 shrink-0 lg:block"
            :style="{ background: project.accent }"
            aria-hidden="true"
          />
          <span class="font-mono text-[0.7rem] tracking-[0.12em] text-faint uppercase lg:mt-1">
            {{ project.focus }}
          </span>
        </div>

        <!-- body -->
        <div class="min-w-0">
          <h2
            class="font-serif text-[clamp(1.6rem,3.4vw,2.4rem)] leading-tight tracking-[-0.035em] transition-colors duration-500 group-hover:text-ember"
          >
            {{ project.title }}
          </h2>
          <p class="mt-1.5 text-[0.82rem] text-ember/80">{{ project.tagline }}</p>
          <p class="mt-4 max-w-2xl text-[0.9rem] leading-relaxed text-muted">
            {{ project.description }}
          </p>

          <div class="mt-6 flex flex-wrap gap-1.5">
            <span
              v-for="tech in project.tech"
              :key="tech"
              class="rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[0.7rem] text-ink-soft"
            >
              {{ tech }}
            </span>
          </div>

          <dl class="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <div v-for="fact in project.facts" :key="fact.label">
              <dt class="font-mono text-[0.72rem] tracking-[0.13em] text-faint uppercase">
                {{ fact.label }}
              </dt>
              <dd class="mt-0.5 font-serif text-[1rem]">{{ fact.value }}</dd>
            </div>
          </dl>
        </div>

        <!-- links -->
        <div class="flex flex-col gap-2.5 lg:pt-2">
          <a
            :href="project.demo"
            target="_blank"
            rel="noreferrer"
            class="group/link inline-flex items-center justify-between gap-3 rounded-full border border-line bg-paper px-4 py-2.5 text-[0.78rem] transition-all duration-500 hover:-translate-y-0.5 hover:border-ember/50 hover:text-ember"
          >
            在线演示
            <ExternalLink :size="13" />
          </a>
          <a
            :href="project.code"
            target="_blank"
            rel="noreferrer"
            class="group/link inline-flex items-center justify-between gap-3 rounded-full border border-line px-4 py-2.5 text-[0.78rem] text-ink-soft transition-all duration-500 hover:-translate-y-0.5 hover:border-ember/50 hover:text-ember"
          >
            查看代码
            <Github :size="13" />
          </a>
        </div>
      </article>
    </section>

    <section v-reveal class="py-14">
      <div class="grid gap-6 rounded-[1.75rem] border border-line bg-paper-2/70 p-7 sm:p-9 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p class="eyebrow">Still growing</p>
          <h2 class="mt-3 font-serif text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight tracking-[-0.04em]">
            下一个项目正在孵化
          </h2>
          <p class="mt-3 max-w-lg text-[0.88rem] leading-relaxed text-muted">
            除了这三个已经上线的作品，我还在持续维护 Vite DevTools，并把过程中踩到的坑写进知识笔记里。
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3 lg:justify-end">
          <RouterLink
            to="/lab"
            class="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[0.8rem] text-canvas transition-transform duration-500 hover:-translate-y-0.5"
          >
            去实验室看看
            <ArrowUpRight :size="13" />
          </RouterLink>
          <RouterLink
            to="/notes"
            class="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[0.8rem] transition-colors hover:border-ember/50 hover:text-ember"
          >
            读技术笔记
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

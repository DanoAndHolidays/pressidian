<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ArrowUpRight, ChevronLeft, Link2, ListTree, Share2 } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import NoteStatusBadge from '@/components/notes/NoteStatusBadge.vue'
import KnowledgeTree from '@/components/notes/KnowledgeTree.vue'
import ContentLoading from '@/components/shell/ContentLoading.vue'
import { useNotesStore } from '@/stores/notes'
import { useDocumentStore } from '@/stores/documents'
import { prefetchNoteGroup } from '@/lib/notes/loader'
import { useClipboard, useActiveHeading } from '@/composables/useInteractions'
import { compactNumber, formatDate, relativeTime } from '@/lib/format'
import { cn } from '@/lib/utils'

const route = useRoute()
const notes = useNotesStore()
const documents = useDocumentStore()
const { copied, copy } = useClipboard()

const treeOpen = ref(false)
const tocOpen = ref(false)

// The route path *is* the note path — `pathMatch(.*)*` keeps slashes intact.
const notePath = computed(() => decodeURIComponent(route.path).replace(/\/$/, ''))
const note = computed(() => notes.byPath.get(notePath.value))

const document_ = computed(() => documents.cache.get(notePath.value))
const loading = computed(() => documents.isPending(notePath.value))
const failure = computed(() => documents.errorOf(notePath.value))
const headings = computed(() => document_.value?.headings ?? [])
const activeHeading = useActiveHeading(headings)

const related = computed(() => notes.relatedOf(notePath.value))
const neighbours = computed(() => notes.neighboursOf(notePath.value))
const backlinks = computed(() =>
  notes.notes.filter((entry) => entry.related.some((relation) => relation.path === notePath.value)).slice(0, 6),
)

// Load (once) whenever the route settles on a note.
const load = async (path: string) => {
  if (!path || documents.isCached(path)) return
  await documents.load(path)
}

watch(
  notePath,
  (path) => {
    treeOpen.value = false
    tocOpen.value = false
    window.scrollTo({ top: 0 })
    void load(path)
  },
  { immediate: true },
)

// Copies the full address, hash included — under hash routing the route lives
// in `location.hash`, so `pathname` alone would share the site root.
const share = () => copy(window.location.href)
</script>

<template>
  <div class="shell-wide pt-6">
    <div class="grid gap-10 lg:grid-cols-[16.5rem_minmax(0,1fr)] xl:grid-cols-[17.5rem_minmax(0,1fr)_14rem]">
      <!-- ============ LEFT: tree ============ -->
      <aside class="hidden lg:block">
        <div class="sticky top-[6.5rem] max-h-[calc(100svh-8.5rem)] overflow-x-hidden overflow-y-auto pr-1">
          <RouterLink
            to="/notes"
            class="mb-3 inline-flex items-center gap-1.5 font-mono text-[0.7rem] tracking-[0.12em] text-faint uppercase transition-colors hover:text-ember"
          >
            <ChevronLeft :size="12" />
            返回索引
          </RouterLink>
          <KnowledgeTree />
        </div>
      </aside>

      <!-- ============ MIDDLE: article ============ -->
      <article class="min-w-0">
        <!-- mobile controls -->
        <div class="mb-5 flex items-center gap-2 lg:hidden">
          <button
            type="button"
            class="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[0.74rem] transition-colors"
            :class="treeOpen ? 'border-ember/50 text-ember' : 'text-ink-soft'"
            @click="treeOpen = !treeOpen"
          >
            <ListTree :size="13" /> 目录
          </button>
          <button
            v-if="headings.length"
            type="button"
            class="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[0.74rem] transition-colors"
            :class="tocOpen ? 'border-ember/50 text-ember' : 'text-ink-soft'"
            @click="tocOpen = !tocOpen"
          >
            大纲 <span class="font-mono text-[0.7rem] text-faint">{{ headings.length }}</span>
          </button>
        </div>

        <div v-if="treeOpen" class="mb-6 rounded-2xl border border-line bg-paper p-4 lg:hidden">
          <KnowledgeTree />
        </div>
        <div v-if="tocOpen && headings.length" class="mb-6 rounded-2xl border border-line bg-paper p-4 lg:hidden">
          <RouterLink
            v-for="heading in headings"
            :key="heading.id"
            :to="{ path: route.path, hash: `#${heading.id}` }"
            custom
            v-slot="{ href, navigate }"
          >
            <a
              :href="href"
              class="block py-1 text-[0.8rem] text-muted"
              :style="{ paddingLeft: `${(heading.depth - 2) * 12}px` }"
              @click="navigate($event); tocOpen = false"
            >
              {{ heading.text }}
            </a>
          </RouterLink>
        </div>

        <!-- note header -->
        <header v-if="note" class="border-b border-line pb-7">
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <NoteStatusBadge :status="note.status" variant="chip" />
            <span class="font-mono text-[0.7rem] text-faint">
              {{ note.segments.slice(0, 3).join(' / ') || '笔记库' }}
            </span>
          </div>

          <h1
            class="mt-5 font-serif text-[clamp(1.9rem,4.4vw,3.1rem)] leading-[1.08] tracking-[-0.045em]"
          >
            {{ note.title }}
          </h1>
          <p v-if="note.description" class="mt-4 max-w-2xl text-[0.92rem] leading-relaxed text-muted">
            {{ note.description }}
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.7rem] text-faint">
            <span>{{ formatDate(note.date) }} · {{ relativeTime(note.date) }}</span>
            <span>{{ note.readingTime }} 分钟阅读</span>
            <span>{{ compactNumber(note.weight) }} 字</span>
            <span v-if="note.degree">{{ note.degree }} 条关联</span>
            <button
              type="button"
              class="ml-auto flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 transition-colors hover:border-ember/50 hover:text-ember"
              @click="share"
            >
              <Share2 :size="11" />
              {{ copied ? '已复制链接' : '分享' }}
            </button>
          </div>
        </header>

        <!-- body -->
        <ContentLoading v-if="loading" />

        <div
          v-else-if="failure"
          class="my-12 rounded-2xl border border-dashed border-line-strong/70 px-6 py-14 text-center"
        >
          <p class="font-serif text-xl">这篇笔记暂时无法渲染。</p>
          <p class="mt-2 font-mono text-[0.72rem] text-faint">{{ failure }}</p>
        </div>

        <div
          v-else-if="document_"
          class="prose-pressidian mt-9"
          v-html="document_.html"
        />

        <div v-else class="my-12 text-center text-muted">没有找到这篇笔记。</div>

        <!-- prev / next -->
        <nav
          v-if="neighbours.previous || neighbours.next"
          class="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2"
          aria-label="相邻笔记"
        >
          <RouterLink
            v-if="neighbours.previous"
            :to="neighbours.previous.path"
            class="group rounded-xl border border-line bg-paper p-4 transition-all duration-500 hover:-translate-y-1 hover:border-ember/45"
            @pointerenter="prefetchNoteGroup(neighbours.previous.path)"
          >
            <span class="font-mono text-[0.7rem] tracking-[0.14em] text-faint uppercase">上一篇</span>
            <p class="mt-2 font-serif text-[1.02rem] leading-snug transition-colors group-hover:text-ember">
              {{ neighbours.previous.title }}
            </p>
          </RouterLink>
          <RouterLink
            v-if="neighbours.next"
            :to="neighbours.next.path"
            class="group rounded-xl border border-line bg-paper p-4 text-right transition-all duration-500 hover:-translate-y-1 hover:border-ember/45 sm:col-start-2"
            @pointerenter="prefetchNoteGroup(neighbours.next.path)"
          >
            <span class="font-mono text-[0.7rem] tracking-[0.14em] text-faint uppercase">下一篇</span>
            <p class="mt-2 font-serif text-[1.02rem] leading-snug transition-colors group-hover:text-ember">
              {{ neighbours.next.title }}
            </p>
          </RouterLink>
        </nav>

        <!-- related + backlinks -->
        <section v-if="related.length || backlinks.length" class="mt-14 grid gap-8 md:grid-cols-2">
          <div v-if="related.length">
            <p class="eyebrow flex items-center gap-2">
              <Link2 :size="12" /> 关联笔记
            </p>
            <ul class="mt-4 grid gap-2">
              <li v-for="entry in related" :key="entry.note.path">
                <RouterLink
                  :to="entry.note.path"
                  class="group flex items-start gap-3 rounded-xl border border-line bg-paper px-3.5 py-3 transition-colors hover:border-ember/45"
                >
                  <ArrowUpRight :size="13" class="mt-1 shrink-0 text-ember" />
                  <span class="min-w-0">
                    <span class="block truncate text-[0.86rem] transition-colors group-hover:text-ember">
                      {{ entry.note.title }}
                    </span>
                    <span class="block font-mono text-[0.7rem] text-faint">{{ entry.relation }}</span>
                  </span>
                </RouterLink>
              </li>
            </ul>
          </div>

          <div v-if="backlinks.length">
            <p class="eyebrow">反向链接</p>
            <ul class="mt-4 grid gap-2">
              <li v-for="entry in backlinks" :key="entry.path">
                <RouterLink
                  :to="entry.path"
                  class="group flex items-start gap-3 rounded-xl border border-line bg-paper px-3.5 py-3 transition-colors hover:border-ember/45"
                >
                  <span class="mt-1 size-1.5 shrink-0 rounded-full bg-jade" aria-hidden="true" />
                  <span class="min-w-0">
                    <span class="block truncate text-[0.86rem] transition-colors group-hover:text-ember">
                      {{ entry.title }}
                    </span>
                    <span class="block font-mono text-[0.7rem] text-faint">
                      {{ entry.segments.slice(-2).join(' / ') || '笔记库' }}
                    </span>
                  </span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </section>
      </article>

      <!-- ============ RIGHT: outline ============ -->
      <aside class="hidden xl:block">
        <div class="sticky top-[6.5rem] max-h-[calc(100svh-8.5rem)] min-w-0 overflow-x-hidden overflow-y-auto">
          <p class="eyebrow">On this page</p>
          <!--
            `custom` + slot rather than a bare `<a href="#id">`.

            Under hash history the route itself lives in the fragment, so a
            plain fragment href *replaces* the route with the heading id —
            clicking an outline entry used to land on the 404 page. The slot's
            `href` is the router-resolved one (`#/notes/…/note#heading`), which
            keeps open-in-new-tab honest, and `navigate` performs the route
            change that `scrollBehavior` turns into a smooth scroll.

            `custom` also keeps RouterLink from stamping every entry with
            `router-link-active` / `aria-current="page"` — all of them share the
            current path, so all of them would claim to be the current page.
          -->
          <nav v-if="headings.length" class="mt-4 border-l border-line" aria-label="本页大纲">
            <RouterLink
              v-for="heading in headings"
              :key="heading.id"
              :to="{ path: route.path, hash: `#${heading.id}` }"
              custom
              v-slot="{ href, navigate }"
            >
              <a
                :href="href"
                v-tooltip="heading.text"
                :class="
                  cn(
                    '-ml-px block truncate border-l py-1.5 pr-2 text-[0.76rem] leading-snug transition-colors duration-300',
                    activeHeading === heading.id
                      ? 'border-ember text-ember'
                      : 'border-transparent text-muted hover:border-line-strong hover:text-ink',
                  )
                "
                :style="{ paddingLeft: `${10 + (heading.depth - 2) * 11}px` }"
                @click="navigate"
              >
                {{ heading.text }}
              </a>
            </RouterLink>
          </nav>
          <p v-else class="mt-4 text-[0.76rem] text-faint">这篇笔记没有分级标题。</p>

          <!--
            The rail used to repeat the document's reading progress bar, which
            the header already shows. It now surfaces what the note actually
            declares, and drops any row the vault left empty.
          -->
          <div v-if="note" class="mt-8 border-t border-line pt-5">
            <p class="font-mono text-[0.7rem] tracking-[0.14em] text-faint uppercase">Note info</p>
            <dl class="mt-3 grid min-w-0 gap-2.5">
              <div class="flex min-w-0 items-baseline justify-between gap-3">
                <dt class="shrink-0 font-mono text-[0.66rem] tracking-[0.1em] text-faint uppercase">
                  Status
                </dt>
                <dd class="min-w-0"><NoteStatusBadge :status="note.status" /></dd>
              </div>

              <div v-if="note.date" class="flex min-w-0 items-baseline justify-between gap-3">
                <dt class="shrink-0 font-mono text-[0.66rem] tracking-[0.1em] text-faint uppercase">
                  Date
                </dt>
                <dd class="min-w-0 truncate text-right text-[0.76rem] text-ink-soft" v-tooltip="formatDate(note.date)">
                  {{ formatDate(note.date) }}
                  <span
                    v-if="note.dateSource === 'inferred'"
                    v-tooltip.always="'这个日期是从正文或文件名推测出来的'"
                    class="ml-1 rounded border border-line px-1 font-mono text-[0.6rem] text-faint"
                  >
                    推测
                  </span>
                </dd>
              </div>

              <div v-if="note.readingTime" class="flex min-w-0 items-baseline justify-between gap-3">
                <dt class="shrink-0 font-mono text-[0.66rem] tracking-[0.1em] text-faint uppercase">
                  Reading
                </dt>
                <dd class="min-w-0 text-right text-[0.76rem] text-ink-soft">{{ note.readingTime }} 分钟</dd>
              </div>

              <div v-if="note.weight" class="flex min-w-0 items-baseline justify-between gap-3">
                <dt class="shrink-0 font-mono text-[0.66rem] tracking-[0.1em] text-faint uppercase">
                  Words
                </dt>
                <dd class="min-w-0 text-right text-[0.76rem] text-ink-soft">{{ compactNumber(note.weight) }}</dd>
              </div>

              <div v-if="note.degree" class="flex min-w-0 items-baseline justify-between gap-3">
                <dt class="shrink-0 font-mono text-[0.66rem] tracking-[0.1em] text-faint uppercase">
                  Links
                </dt>
                <dd class="min-w-0 text-right text-[0.76rem] text-ink-soft">{{ note.degree }} 条</dd>
              </div>

              <div v-if="note.segments.length" class="flex min-w-0 items-baseline justify-between gap-3">
                <dt class="shrink-0 font-mono text-[0.66rem] tracking-[0.1em] text-faint uppercase">
                  Path
                </dt>
                <dd
                  class="min-w-0 truncate text-right text-[0.76rem] text-ink-soft"
                  v-tooltip="note.segments.join(' / ')"
                >
                  {{ note.segments.join(' / ') }}
                </dd>
              </div>
            </dl>

            <div v-if="note.tags.length" class="mt-4">
              <p class="font-mono text-[0.66rem] tracking-[0.1em] text-faint uppercase">Tags</p>
              <ul class="mt-2 flex min-w-0 flex-wrap gap-1.5">
                <li
                  v-for="tag in note.tags"
                  :key="tag"
                  v-tooltip="tag"
                  class="max-w-full truncate rounded-full border border-line px-2 py-0.5 font-mono text-[0.68rem] text-muted"
                >
                  {{ tag }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

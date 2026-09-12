<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, ArrowUpRight, BookOpen, Compass, FlaskConical, Github, Sparkles } from 'lucide-vue-next'
import PixelTypeLine from '@/components/scene/PixelTypeLine.vue'
import NoteStatusBadge from '@/components/notes/NoteStatusBadge.vue'
import { NAV_ITEMS, PROFILE, PROJECTS, STATUS_META } from '@/data/site'
import { useNotesStore } from '@/stores/notes'
import { useSceneStore } from '@/stores/scene'
import { compactNumber, formatDate, relativeTime } from '@/lib/format'

/**
 * Homepage.
 *
 * This is the page the whole pixel/glitch layer exists for, and the layout is
 * built around one constraint: every panel here is a *window onto the painting*,
 * not a card sitting on it. So there is no page background, no max-width wrapper
 * around the hero, and the panels are translucent with hard 2px frames — the
 * scene has to stay visible between and through them.
 *
 * Type is split by script throughout. `Press Start 2P` has no CJK glyphs, so it
 * is used strictly for Latin labels, numerals and the eyebrow; Chinese headings
 * stay in the serif stack, which is both the readable choice and what keeps the
 * page from looking like a translation of a Japanese game. The terminal readout
 * uses `VT323`, which is the one face here that reads comfortably at length.
 */
const notes = useNotesStore()
const scene = useSceneStore()

const headlineDone = ref(false)

const recent = computed(() => notes.notes.slice(0, 5))

const statusList = computed(() =>
  (Object.keys(STATUS_META) as Array<keyof typeof STATUS_META>).map((key) => ({
    key,
    ...STATUS_META[key],
    count: notes.stats.statusCount[key],
  })),
)

/** Hero shortcuts. Latin `value`s keep the tile figures in the pixel face. */
const mapNodes = [
  { key: 'notes', cjk: '知识笔记', value: () => `${notes.stats.total}`, to: '/notes', icon: BookOpen },
  { key: 'projects', cjk: '项目路径', value: () => `${PROJECTS.length}`, to: '/projects', icon: Compass },
  { key: 'lab', cjk: '狐狸实验室', value: () => 'LAB', to: '/lab', icon: FlaskConical },
  { key: 'github', cjk: '开源足迹', value: () => 'OSS', to: 'https://github.com/DanoAndHolidays', icon: Github },
] as const

/** Telemetry strip. Four values, all real, all from the vault index. */
const telemetry = computed(() => [
  { label: 'NOTES', value: `${notes.stats.total}`, hint: `${notes.stats.folders} 个路径` },
  { label: 'LINKS', value: `${notes.stats.links}`, hint: '双向关联' },
  { label: 'WEIGHT', value: compactNumber(notes.stats.weight), hint: '字符与词' },
  { label: 'UPDATED', value: formatDate(notes.stats.latest), hint: '最近栽种' },
])

/**
 * The ticker. Content is real site state rather than flavour text — it reads
 * like a status line because it is one.
 */
const tickerItems = computed(() => [
  `VAULT ONLINE · ${notes.stats.total} NOTES INDEXED`,
  `${notes.stats.links} WIKI LINKS MAPPED`,
  `${notes.stats.folders} FOLDERS`,
  'RENDERER · PIXEL/CRT',
  'SCENE CYCLE · 14S',
  'OPERATOR · DANO',
])

const isExternal = (to: string) => to.startsWith('http')
</script>

<template>
  <div class="home">
    <!-- ================= HERO ================= -->
    <section class="home__hero">
      <div class="home__hero-inner">
        <!-- Status rail -->
        <div class="home__rail">
          <span class="home__pill">
            <i class="home__dot" aria-hidden="true" />
            <span class="px-label">vault online</span>
            <span class="home__pill-sep" aria-hidden="true">/</span>
            <b class="home__pill-num">{{ notes.stats.total }}</b>
            <span class="px-label">notes</span>
          </span>
          <span class="home__pill home__pill--hide-sm">
            <span class="px-label">scene</span>
            <span class="home__pill-sep" aria-hidden="true">/</span>
            <b class="home__pill-num">{{ scene.label }}</b>
            <span class="home__pill-sep" aria-hidden="true">/</span>
            <b class="home__pill-num">{{ scene.clock }}</b>
          </span>
        </div>

        <!-- Headline + terminal -->
        <div class="home__grid">
          <div class="home__lede">
            <p class="px-label home__eyebrow">{{ PROFILE.eyebrow }}</p>

            <PixelTypeLine
              :text="PROFILE.headline"
              :speed="76"
              :delay="420"
              class="home__headline"
              @done="headlineDone = true"
            />

            <p class="home__intro" :class="{ 'is-visible': headlineDone }">
              {{ PROFILE.intro }}
            </p>

            <div class="home__actions" :class="{ 'is-visible': headlineDone }">
              <RouterLink to="/notes" class="px-btn">
                进入知识花园
                <ArrowRight :size="14" />
              </RouterLink>
              <RouterLink to="/about" class="px-btn px-btn--ghost">
                认识 Dano
                <ArrowUpRight :size="13" />
              </RouterLink>
            </div>
          </div>

          <!-- Terminal readout. Reads live site + scene state. -->
          <div class="home__term px-box px-box--notched">
            <div class="home__term-bar">
              <span class="px-label">scene monitor</span>
              <span class="home__term-led" :class="`is-${scene.current}`" aria-hidden="true" />
            </div>
            <dl class="home__readout px-term">
              <div>
                <dt>operator</dt>
                <dd>{{ PROFILE.name }}<span class="home__dim">@pressidian</span></dd>
              </div>
              <div>
                <dt>role</dt>
                <dd>{{ PROFILE.role }}<span class="home__dim"> · {{ PROFILE.city }}</span></dd>
              </div>
              <div>
                <dt>viewport</dt>
                <dd>{{ scene.label }}<span class="home__dim"> · 巨构时间 {{ scene.clock }}</span></dd>
              </div>
              <div>
                <dt>vault</dt>
                <dd>
                  {{ notes.stats.total }}<span class="home__dim"> notes / {{ notes.stats.links }} links</span>
                </dd>
              </div>
              <div>
                <dt>cycle</dt>
                <dd>
                  <span class="home__cyclebar" :class="{ 'is-bursting': scene.bursting }" aria-hidden="true">
                    <i v-for="n in 14" :key="n" />
                  </span>
                  <span class="home__dim">14s</span>
                </dd>
              </div>
            </dl>
            <p class="home__term-foot px-term">
              <span class="home__prompt">&gt;</span> background alternates day and night
              <span class="px-caret" />
            </p>
          </div>
        </div>

        <!-- Shortcut tiles -->
        <div class="home__tiles">
          <component
            :is="isExternal(node.to) ? 'a' : RouterLink"
            v-for="node in mapNodes"
            :key="node.key"
            :to="isExternal(node.to) ? undefined : node.to"
            :href="isExternal(node.to) ? node.to : undefined"
            :target="isExternal(node.to) ? '_blank' : undefined"
            :rel="isExternal(node.to) ? 'noreferrer' : undefined"
            class="home__tile px-box"
          >
            <span class="home__tile-top">
              <span class="home__tile-label">{{ node.cjk }}</span>
              <component :is="node.icon" :size="14" class="home__tile-icon" />
            </span>
            <span class="home__tile-value px-font">{{ node.value() }}</span>
          </component>
        </div>
      </div>
    </section>

    <!-- ================= TICKER ================= -->
    <div class="home__ticker" aria-hidden="true">
      <div class="home__ticker-track">
        <span v-for="(item, i) in [...tickerItems, ...tickerItems]" :key="i" class="px-label home__ticker-item">
          {{ item }}
          <b>◆</b>
        </span>
      </div>
    </div>

    <!-- ================= TELEMETRY ================= -->
    <section class="home__section">
      <div v-reveal class="home__stats">
        <div v-for="stat in telemetry" :key="stat.label" class="home__stat px-box">
          <p class="px-label">{{ stat.label }}</p>
          <p class="home__stat-value px-font">{{ stat.value }}</p>
          <p class="home__stat-hint">{{ stat.hint }}</p>
        </div>
      </div>
    </section>

    <!-- ================= RECENT NOTES ================= -->
    <section class="home__section">
      <header class="home__head">
        <div>
          <p class="px-label">recently tendered</p>
          <h2 class="home__h2">最近打理的笔记</h2>
        </div>
        <RouterLink to="/notes" class="px-link home__head-link">
          <span class="px-label">view all {{ notes.stats.total }}</span>
          <ArrowRight :size="14" />
        </RouterLink>
      </header>

      <div class="home__cards">
        <RouterLink
          v-for="(note, index) in recent"
          :key="note.path"
          v-reveal="index * 70"
          :to="note.path"
          class="home__card px-box"
        >
          <span class="home__card-top">
            <NoteStatusBadge :status="note.status" />
            <span class="px-label">{{ relativeTime(note.date) }}</span>
          </span>
          <h3 class="home__card-title">{{ note.title }}</h3>
          <p class="home__card-desc">{{ note.description }}</p>
          <span class="home__card-foot">
            <span class="px-label">{{ note.tags.slice(0, 2).join(' / ') || 'UNTAGGED' }}</span>
            <span class="home__card-min px-label">
              {{ note.readingTime }} MIN
              <ArrowUpRight :size="12" />
            </span>
          </span>
        </RouterLink>

        <RouterLink to="/notes" v-reveal="recent.length * 70" class="home__card home__card--empty">
          <span class="home__empty-mark px-font" aria-hidden="true">[ + ]</span>
          <span>
            <span class="home__card-title">下一篇笔记<br />会在这里发芽</span>
            <span class="home__card-desc">
              同步新的 Obsidian 笔记后，这块空地会自动长出内容。
            </span>
          </span>
          <span class="px-label">awaiting planting →</span>
        </RouterLink>
      </div>
    </section>

    <!-- ================= GROWTH STAGES ================= -->
    <section class="home__section">
      <div v-reveal class="home__stages px-box px-box--notched">
        <div class="home__stages-copy">
          <p class="px-label">growth stages</p>
          <h2 class="home__h2">笔记不是归档，<br />而是正在生长的路径。</h2>
          <p class="home__body">
            每篇笔记都带着成熟度标签与关联关系。你可以按主题筛选，也可以顺着双链一路读下去。
          </p>
          <RouterLink to="/notes" class="px-btn">
            <Sparkles :size="14" />
            打开笔记库索引
          </RouterLink>
        </div>

        <div class="home__stages-grid">
          <div v-for="stage in statusList" :key="stage.key" class="home__stage">
            <span class="home__stage-icon" aria-hidden="true">{{ stage.icon }}</span>
            <span class="home__stage-label">{{ stage.label }}</span>
            <span class="px-label">{{ stage.hint }}</span>
            <span class="home__stage-count px-font" :style="{ color: `var(--${stage.tone})` }">
              {{ stage.count }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= PROJECTS ================= -->
    <section class="home__section">
      <header class="home__head">
        <div>
          <p class="px-label">selected work</p>
          <h2 class="home__h2">从花园里长出的项目</h2>
        </div>
        <RouterLink to="/projects" class="px-link home__head-link">
          <span class="px-label">all projects</span>
          <ArrowRight :size="14" />
        </RouterLink>
      </header>

      <div class="home__projects">
        <a
          v-for="(project, index) in PROJECTS"
          :key="project.id"
          v-reveal="index * 90"
          :href="project.demo"
          target="_blank"
          rel="noreferrer"
          class="home__project px-box"
        >
          <span class="home__project-top">
            <span class="px-label">{{ project.index }} · {{ project.focus }}</span>
            <ArrowUpRight :size="15" class="home__project-arrow" />
          </span>
          <span class="home__project-title">{{ project.title }}</span>
          <span class="home__project-tagline">{{ project.tagline }}</span>
          <span class="home__project-desc">{{ project.description }}</span>
          <span class="home__project-tech">
            <span v-for="tech in project.tech.slice(0, 3)" :key="tech" class="px-label home__chip">
              {{ tech }}
            </span>
          </span>
        </a>
      </div>
    </section>

    <!-- ================= PROFILE + QUICK NAV ================= -->
    <section class="home__section">
      <div v-reveal class="home__profile px-box">
        <div v-for="item in [
          { label: 'CURRENTLY', value: PROFILE.currently },
          { label: 'OPEN SOURCE', value: PROFILE.openSource },
          { label: 'EDUCATION', value: PROFILE.education },
        ]" :key="item.label" class="home__profile-cell">
          <p class="px-label">{{ item.label }}</p>
          <p class="home__profile-value">{{ item.value }}</p>
        </div>
        <RouterLink to="/about" class="home__profile-cell home__profile-link">
          <span class="home__profile-value">完整经历</span>
          <ArrowUpRight :size="16" class="home__tile-icon" />
        </RouterLink>
      </div>

      <div class="home__nav">
        <RouterLink
          v-for="(item, index) in NAV_ITEMS.slice(1)"
          :key="item.key"
          v-reveal="index * 70"
          :to="item.to"
          class="px-row home__nav-row"
        >
          <span>
            <span class="home__nav-label">{{ item.label }}</span>
            <span class="px-label">{{ item.hint }}</span>
          </span>
          <ArrowRight :size="15" class="home__nav-arrow" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  position: relative;
  /* No background: the fixed stage is the background, and a solid fill here
     would hide it. Content legibility is handled by the panels instead. */
  padding-bottom: 6rem;
}

/* --------------------------------------------------------------------------
   Content scrim

   The hero is meant to be read straight off the painting, but everything below
   it is a utility surface — a marquee, four stat tiles, five note cards, the
   footer. Those cannot sit directly on a photograph: the daylight painting is
   near-white in the sky, so white text vanishes into it, and dark text is
   unreadable against the night one.

   So the page fades its own backdrop in as it scrolls away from the hero. It
   is a gradient rather than a flat panel, which keeps the painting visible
   through it and keeps the transition from reading as the page changing colour
   halfway down. `backdrop-filter` blurs what shows through, so the texture
   behind stays soft and never competes with the type on top.
   -------------------------------------------------------------------------- */
.home::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    transparent 0,
    transparent 62vh,
    color-mix(in oklab, var(--px-bg) 82%, transparent) 88vh,
    color-mix(in oklab, var(--px-bg) 94%, transparent) 100%
  );
  backdrop-filter: blur(3px);
  -webkit-mask-image: linear-gradient(180deg, transparent 0, transparent 58vh, #000 84vh);
  mask-image: linear-gradient(180deg, transparent 0, transparent 58vh, #000 84vh);
}

/* ================= hero ================= */
.home__hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  padding: 68px 0 4.5rem;
}

.home__hero-inner {
  width: min(100% - 2.5rem, 94rem);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vh, 2.5rem);
  justify-content: center;
  flex: 1;
}

.home__rail {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.home__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.75rem;
  border: 2px solid var(--px-line);
  background: color-mix(in oklab, var(--px-panel-solid) 76%, transparent);
  backdrop-filter: blur(6px);
}

.home__dot {
  width: 7px;
  height: 7px;
  background: var(--px-accent);
  animation: px-blink 2.2s steps(1, end) infinite;
}

.home__pill-sep {
  color: var(--px-fg-faint);
}

.home__pill-num {
  color: var(--px-accent);
  font-family: var(--font-pixel);
  font-size: 0.62rem;
}

.home__grid {
  display: grid;
  gap: clamp(1.5rem, 3vw, 3rem);
  align-items: center;
}

@media (min-width: 1024px) {
  .home__grid {
    grid-template-columns: minmax(0, 1fr) minmax(300px, 0.62fr);
  }
}

.home__eyebrow {
  color: var(--px-accent);
}

.home__headline {
  margin-top: 1.1rem;
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5.4vw, 3.9rem);
  line-height: 1.16;
  letter-spacing: -0.035em;
  color: var(--px-fg);
  text-shadow:
    0 2px 0 rgb(0 0 0 / 0.55),
    0 0 44px rgb(0 0 0 / 0.5);
}

/* The copy and buttons follow the headline rather than animating alongside it,
   so the eye is led down the page instead of being given three things at once. */
.home__intro,
.home__actions {
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.5s steps(6, end),
    transform 0.5s steps(6, end);
}

.home__intro.is-visible,
.home__actions.is-visible {
  opacity: 1;
  transform: none;
}

.home__intro {
  margin-top: 1.35rem;
  max-width: 34rem;
  font-size: 0.95rem;
  line-height: 1.85;
  /* The paintings are busy; a heavier scrim behind the copy is cheaper than
     dimming the whole scene, which would kill the artwork. */
  color: var(--px-fg);
  text-shadow:
    0 1px 3px rgb(0 0 0 / 0.85),
    0 0 18px rgb(0 0 0 / 0.7);
  transition-delay: 0.15s;
}

.home__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.85rem;
  transition-delay: 0.3s;
}

/* ---- terminal readout ---- */
.home__term {
  background: color-mix(in oklab, var(--px-panel-solid) 84%, transparent);
  backdrop-filter: blur(8px);
}

.home__term-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.85rem;
  border-bottom: 2px solid var(--px-line);
  background: color-mix(in oklab, var(--px-accent) 12%, transparent);
}

.home__term-led {
  margin-left: auto;
  width: 10px;
  height: 10px;
  background: var(--px-cyan);
}

.home__term-led.is-night {
  background: var(--px-magenta);
}

.home__readout {
  display: grid;
  gap: 0.1rem;
  margin: 0;
  padding: 0.75rem 0.9rem;
  font-size: 1.05rem;
  color: var(--px-fg);
}

.home__readout > div {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.home__readout dt {
  flex: 0 0 8ch;
  /* The VT323 metrics are narrow; nowrap stops the five keys from each landing
     on a different baseline as the column is squeezed. */
  white-space: nowrap;
  color: var(--px-cyan);
}

.home__readout dd {
  margin: 0;
}

.home__dim {
  color: var(--px-fg-faint);
}

.home__cyclebar {
  display: inline-flex;
  gap: 2px;
  margin-right: 0.5rem;
  vertical-align: middle;
}

.home__cyclebar i {
  width: 5px;
  height: 11px;
  background: var(--px-accent);
  opacity: 0.85;
  animation: home-cycle 14s steps(14, end) infinite;
}

/* One cell lights per second across the cycle, then resets. */
@keyframes home-cycle {
  0% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}

.home__cyclebar.is-bursting i {
  background: var(--px-magenta);
}

.home__term-foot {
  margin: 0;
  padding: 0.6rem 0.9rem 0.8rem;
  border-top: 2px solid var(--px-line);
  color: var(--px-green, #6ef08a);
  font-size: 0.95rem;
}

.home__prompt {
  color: var(--px-accent);
}

/* ---- shortcut tiles ---- */
.home__tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}

@media (min-width: 640px) {
  .home__tiles {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.home__tile {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 0.8rem 0.9rem;
  transition:
    transform 0.14s var(--px-step),
    box-shadow 0.14s var(--px-step),
    border-color 0.14s linear;
}

.home__tile:hover {
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0 0 var(--px-void);
  border-color: var(--px-accent);
}

.home__tile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.home__tile-label {
  font-size: 0.84rem;
  color: var(--px-fg);
}

.home__tile-icon {
  color: var(--px-accent);
  flex: 0 0 auto;
}

.home__tile-value {
  font-size: 1.05rem;
  color: var(--px-fg);
  line-height: 1;
}

/* ================= ticker ================= */
.home__ticker {
  position: relative;
  overflow: hidden;
  margin-top: clamp(2.5rem, 6vh, 4.5rem);
  border-block: 2px solid var(--px-line);
  background: color-mix(in oklab, var(--px-panel-solid) 88%, transparent);
  backdrop-filter: blur(10px);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.home__ticker-track {
  display: flex;
  width: max-content;
  animation: px-marquee 38s linear infinite;
}

.home__ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 1.1rem;
  padding: 0.65rem 1.1rem;
  white-space: nowrap;
  color: var(--px-fg-dim);
}

.home__ticker-item b {
  color: var(--px-accent);
  font-weight: 400;
}

/* ================= sections ================= */
.home__section {
  width: min(100% - 2.5rem, 94rem);
  margin-inline: auto;
  padding-top: clamp(3.5rem, 8vh, 6rem);
}

.home__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.home__head-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--px-accent);
}

.home__h2 {
  margin: 0.7rem 0 0;
  font-family: var(--font-serif);
  font-size: clamp(1.6rem, 3.4vw, 2.5rem);
  line-height: 1.22;
  letter-spacing: -0.035em;
  color: var(--px-fg);
  text-shadow: 0 2px 0 rgb(0 0 0 / 0.5);
}

.home__body {
  margin-top: 1rem;
  max-width: 30rem;
  font-size: 0.88rem;
  line-height: 1.85;
  color: var(--px-fg-dim);
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.8);
}

/* ---- telemetry ---- */
.home__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}

@media (min-width: 900px) {
  .home__stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.home__stat {
  padding: 0.9rem 1rem;
}

.home__stat-value {
  margin: 0.6rem 0 0;
  font-size: 1.15rem;
  color: var(--px-accent);
  line-height: 1.3;
}

.home__stat-hint {
  margin: 0.4rem 0 0;
  font-size: 0.76rem;
  color: var(--px-fg-faint);
}

/* ---- note cards ---- */
.home__cards {
  display: grid;
  gap: 0.8rem;
}

@media (min-width: 700px) {
  .home__cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1180px) {
  .home__cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.home__card {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  min-height: 13rem;
  padding: 1rem 1.05rem;
  text-decoration: none;
  transition:
    border-color 0.14s linear,
    transform 0.14s var(--px-step),
    box-shadow 0.14s var(--px-step);
}

.home__card:hover {
  border-color: var(--px-accent);
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0 0 var(--px-void);
}

.home__card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}

/* The badge is shared with the paper-themed notes index, where its own
   `--jade` / `--amber` tones are tuned for a light field. On the homepage's
   near-black panels those tones sink into the background, so the label is
   lifted to the pixel face and the dot keeps its colour as the only signal. */
.home__card-top :deep(span) {
  color: var(--px-fg-dim);
}

.home__card-top :deep(.font-mono) {
  font-family: var(--font-pixel);
  font-size: 0.68em;
  letter-spacing: 0.06em;
}

.home__card-title {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  line-height: 1.4;
  letter-spacing: -0.02em;
  color: var(--px-fg);
}

.home__card-desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--px-fg-dim);
}

.home__card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  margin-top: auto;
  padding-top: 0.8rem;
  border-top: 2px dashed var(--px-line);
}

.home__card-min {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--px-accent);
}

/* The empty slot is drawn as a dashed win32 placeholder, not a card. */
.home__card--empty {
  border-style: dashed;
  background: transparent;
  justify-content: space-between;
  box-shadow: none;
}

.home__card--empty:hover {
  transform: none;
  box-shadow: none;
  background: color-mix(in oklab, var(--px-accent) 8%, transparent);
}

.home__card--empty .home__card-title,
.home__card--empty .home__card-desc {
  display: block;
}

.home__empty-mark {
  font-size: 0.8rem;
  color: var(--px-fg-faint);
}

/* ---- growth stages ---- */
.home__stages {
  display: grid;
  gap: 1.75rem;
  padding: clamp(1.25rem, 3vw, 2.25rem);
}

@media (min-width: 1024px) {
  .home__stages {
    grid-template-columns: 1fr 1.15fr;
    gap: 2.5rem;
  }
}

.home__stages-copy .px-btn {
  margin-top: 1.5rem;
}

.home__stages-grid {
  display: grid;
  gap: 0.7rem;
}

@media (min-width: 560px) {
  .home__stages-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.home__stage {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.9rem;
  border: 2px solid var(--px-line-soft);
  background: color-mix(in oklab, var(--px-panel-solid) 60%, transparent);
}

.home__stage-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.home__stage-label {
  color: var(--px-fg);
  font-size: 0.95rem;
}

.home__stage-count {
  margin-top: 0.5rem;
  font-size: 1.4rem;
  line-height: 1;
}

/* ---- projects ---- */
.home__projects {
  display: grid;
  gap: 0.8rem;
}

@media (min-width: 900px) {
  .home__projects {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.home__project {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-height: 15rem;
  padding: 1rem 1.05rem;
  text-decoration: none;
  transition:
    border-color 0.14s linear,
    transform 0.14s var(--px-step),
    box-shadow 0.14s var(--px-step);
}

.home__project:hover {
  border-color: var(--px-accent);
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0 0 var(--px-void);
}

.home__project-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.home__project-top .px-label {
  color: var(--px-accent);
}

.home__project-arrow {
  color: var(--px-fg-faint);
  flex: 0 0 auto;
}

.home__project-title {
  margin-top: 0.6rem;
  font-family: var(--font-serif);
  font-size: 1.4rem;
  letter-spacing: -0.02em;
  color: var(--px-fg);
}

.home__project-tagline {
  font-size: 0.78rem;
  color: var(--px-accent);
}

.home__project-desc {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--px-fg-dim);
}

.home__project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: auto;
  padding-top: 0.9rem;
}

.home__chip {
  padding: 0.15rem 0.45rem;
  border: 2px solid var(--px-line-soft);
  color: var(--px-fg-faint);
}

/* ---- profile + nav ---- */
.home__profile {
  display: grid;
  gap: 0;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

@media (min-width: 900px) {
  .home__profile {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.home__profile-cell {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
  padding: 1.1rem 1.15rem;
  border-bottom: 2px solid var(--px-line-soft);
}

@media (min-width: 900px) {
  .home__profile-cell {
    border-bottom: 0;
    border-right: 2px solid var(--px-line-soft);
  }
  .home__profile-cell:last-child {
    border-right: 0;
  }
}

.home__profile-value {
  color: var(--px-fg);
  font-size: 0.95rem;
  line-height: 1.5;
}

.home__profile-link {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  transition: background-color 0.14s linear;
}

.home__profile-link:hover {
  background: color-mix(in oklab, var(--px-accent) 10%, transparent);
}

.home__nav {
  display: grid;
  gap: 0.6rem;
}

@media (min-width: 700px) {
  .home__nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1180px) {
  .home__nav {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.home__nav-row {
  text-decoration: none;
  justify-content: space-between;
}

.home__nav-label {
  display: block;
  color: var(--px-fg);
  font-size: 0.9rem;
}

.home__nav-arrow {
  color: var(--px-fg-faint);
  flex: 0 0 auto;
}

.home__nav-row:hover .home__nav-arrow {
  color: var(--px-accent);
}

@media (max-width: 639px) {
  .home__pill--hide-sm {
    display: none;
  }
  .home__hero {
    min-height: auto;
    padding-bottom: 2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home__intro,
  .home__actions {
    opacity: 1;
    transform: none;
  }
  .home__ticker-track {
    animation: none;
  }
}
</style>

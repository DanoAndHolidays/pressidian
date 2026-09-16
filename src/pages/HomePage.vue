<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, ArrowUpRight, BookOpen, Code2, FlaskConical, Github, Leaf, MoveDown, Pause, Play, Sun, Moon } from 'lucide-vue-next'
import NoteStatusBadge from '@/components/notes/NoteStatusBadge.vue'
import { PROFILE, PROJECTS, STATUS_META } from '@/data/site'
import { SCENES } from '@/data/scenes'
import AsciiScene from '@/components/ascii/AsciiScene.vue'
import { useReducedMotion } from '@/composables/useMediaQuery'
import type { RenderMode } from '@/lib/ascii/types'
import { useNotesStore } from '@/stores/notes'
import { compactNumber, formatDate, relativeTime } from '@/lib/format'

const notes = useNotesStore()
const scene = ref<'day' | 'night'>('day')
const renderMode = ref<RenderMode>('mosaic')
const paused = ref(false)
const glitchEnabled = ref(true)
const reduced = useReducedMotion()
const recent = computed(() => notes.notes.slice(0, 4))
const stages = computed(() => (Object.keys(STATUS_META) as Array<keyof typeof STATUS_META>).map(key => ({
  key, ...STATUS_META[key], count: notes.stats.statusCount[key],
})))
const stats = computed(() => [
  { value: String(notes.stats.total), label: '篇持续生长的笔记', en: 'NOTES & THOUGHTS' },
  { value: String(PROJECTS.length).padStart(2, '0'), label: '个想法成为了作品', en: 'SELECTED PROJECTS' },
  { value: String(notes.stats.links), label: '条知识之间的关联', en: 'CONNECTED IDEAS' },
  { value: compactNumber(notes.stats.weight), label: '字积累与思考', en: 'WORDS CULTIVATED' },
])
</script>

<template>
  <div class="home">
    <section class="garden-hero" aria-labelledby="home-title">
      <div class="scene-layer">
        <AsciiScene :src="SCENES[scene].poster" :mode="renderMode" :paused="paused" :glitch="glitchEnabled" />
        <div class="scene-scrim" /><div class="scene-grid" />
      </div>
      <div class="hero-coordinate"><span><i /> PERSONAL SPACE / {{ PROFILE.name.toUpperCase() }}</span><span>FRONTEND ENGINEER · {{ PROFILE.city }}</span></div>
      <div class="hero-copy">
        <p class="hero-eyebrow"><span />CREATIVE DEVELOPMENT & DIGITAL GARDEN</p>
        <h1 id="home-title">IDEAS<br /><span>IN ORBIT</span><b aria-hidden="true">_</b></h1>
        <p class="hero-english">让作品与想法，一起生长。</p>
        <p class="hero-description">我是 {{ PROFILE.name }}，一名前端开发者。<br />以代码构建体验，在记录中连接知识，让好奇心不断向外探索。</p>
        <div class="hero-actions">
          <RouterLink to="/notes" class="garden-button">进入知识宇宙 <ArrowUpRight :size="17" /></RouterLink>
          <RouterLink to="/projects" class="text-link">探索我的作品 <ArrowRight :size="15" /></RouterLink>
        </div>
        <div class="hero-current"><span class="status-dot" /><span>{{ PROFILE.currently }}</span><span class="hero-current__sep">/</span><span>{{ notes.stats.total }} 个知识节点已连接</span></div>
      </div>
      <div class="scene-caption" aria-hidden="true"><span class="scene-cross">+</span><span>BEYOND THE<br />KNOWN HORIZON.</span><small>001 / {{ scene === 'day' ? 'DAYLIGHT' : 'NIGHTFALL' }}<br />MEGASTRUCTURE · SNOWFIELD</small></div>
      <div class="hero-bottom">
        <RouterLink class="hero-scroll" :to="{ path: '/', hash: '#garden-notes' }"><MoveDown :size="13" />向下探索 <span>SCROLL TO DISCOVER</span></RouterLink>
        <div class="scene-controls" aria-label="背景视觉设置">
          <div class="scene-control-group">
            <button :aria-pressed="scene === 'day'" aria-label="切换到雪原昼景" @click="scene = 'day'"><Sun :size="13" /><span>昼景</span></button>
            <button :aria-pressed="scene === 'night'" aria-label="切换到行星夜景" @click="scene = 'night'"><Moon :size="13" /><span>夜景</span></button>
          </div>
          <div class="scene-control-group">
            <button :aria-pressed="renderMode === 'mosaic'" @click="renderMode = 'mosaic'">像素</button>
            <button :aria-pressed="renderMode === 'characters'" @click="renderMode = 'characters'">字符</button>
          </div>
          <button class="glitch-control" :aria-pressed="glitchEnabled" :disabled="reduced" @click="glitchEnabled = !glitchEnabled"><i />故障</button>
          <button class="motion-control" :aria-label="reduced ? '已遵循系统减少动态效果设置' : paused ? '播放背景动效' : '暂停背景动效'" :disabled="reduced" @click="paused = !paused"><Play v-if="paused || reduced" :size="14" /><Pause v-else :size="14" /></button>
        </div>
      </div>
    </section>

    <section class="garden-stats" aria-label="花园概览">
      <div v-for="stat in stats" :key="stat.en" class="garden-stat"><span class="garden-stat__value">{{ stat.value }}<i>↗</i></span><span class="garden-stat__label">{{ stat.label }}</span><span class="micro-label">{{ stat.en }}</span></div>
    </section>

    <section id="garden-notes" class="garden-section notes-section">
      <div class="section-heading"><div><p class="eyebrow">01 / KNOWLEDGE ARCHIVE</p><h2>连接知识，<span>拓展认知边界。</span></h2></div><RouterLink to="/notes" class="text-link">全部笔记 <ArrowUpRight :size="16" /></RouterLink></div>
      <div class="notes-layout">
        <div class="note-list">
          <RouterLink v-for="(note, index) in recent" :key="note.path" v-reveal="index * 55" :to="note.path" class="note-row">
            <span class="note-row__index">0{{ index + 1 }}</span>
            <div class="note-row__body"><div class="note-row__meta"><NoteStatusBadge :status="note.status" /><span>{{ note.dateSource === 'declared' ? relativeTime(note.date) : formatDate(note.date) }} · {{ note.readingTime }} 分钟阅读</span></div><h3>{{ note.title }}</h3><p>{{ note.description }}</p><span class="note-row__tags">{{ note.tags.slice(0, 3).join(' / ') || '随记与思考' }}</span></div>
            <ArrowUpRight :size="19" class="note-row__arrow" />
          </RouterLink>
          <div v-if="!recent.length" class="notes-empty"><Leaf :size="26" /><h3>第一颗种子，等你种下。</h3><p>新的笔记会在这里慢慢生长。</p></div>
        </div>
        <aside v-reveal class="garden-fieldnote">
          <div class="fieldnote-top"><span class="micro-label">GROWTH / IN PROGRESS</span><Leaf :size="19" /></div>
          <div class="fieldnote-art" aria-hidden="true"><i /><i /><i /><span>✳</span></div>
          <h3>持续构建，<br />持续进化。</h3>
          <p>从一个念头，到一条路径。<br />每次实践、记录与回望，<br />都让这个知识网络更完整。</p>
          <div class="fieldnote-stages"><div v-for="stage in stages" :key="stage.key"><span><i :class="stage.key" />{{ stage.label }}</span><b>{{ stage.count }}</b></div></div>
          <RouterLink to="/notes" class="fieldnote-link">沿着一条关联，遇见新想法 <ArrowUpRight :size="16" /></RouterLink>
        </aside>
      </div>
    </section>

    <section class="garden-section">
      <div class="section-heading"><div><p class="eyebrow">02 / SELECTED WORK</p><h2>把想法，<span>做成可以触碰的作品。</span></h2></div><RouterLink to="/projects" class="text-link">所有项目 <ArrowUpRight :size="16" /></RouterLink></div>
      <div class="project-grid">
        <a v-for="(project, index) in PROJECTS" :key="project.id" v-reveal="index * 70" :href="project.demo" target="_blank" rel="noreferrer" class="project-card">
          <div class="project-art" :class="'project-art--' + project.id" aria-hidden="true">
            <span class="project-art__label">{{ project.focus }}</span><span class="project-art__number">{{ project.index }}</span>
            <div v-if="index === 0" class="art-player"><div class="art-player__screen"><span>一刻</span><i>▶</i></div><div class="art-player__line" /><span>Every moment, a story.</span></div>
            <div v-else-if="index === 1" class="art-chart"><span>DAMAGE EVOLUTION<span>LIVE ↗</span></span><svg viewBox="0 0 300 110"><path class="chart-grid" d="M0 25H300M0 55H300M0 85H300" /><path class="chart-curve" d="M0 95C30 95 25 79 52 80S85 106 107 64S135 90 162 54S193 67 215 38S250 48 270 18S287 18 300 3" /></svg><b>深岩智测<small>让数据，呈现方向。</small></b></div>
            <div v-else class="art-playlet"><span class="art-playlet__circle">▷</span><b>PLAYLET<span>STORIES IN MOTION</span></b></div>
          </div>
          <div class="project-card__body"><div><h3>{{ project.title }}</h3><ArrowUpRight :size="18" /></div><p>{{ project.tagline }}</p><span class="project-card__tech">{{ project.tech.slice(0, 3).join(' · ') }}</span></div>
        </a>
      </div>
    </section>

    <section v-reveal class="garden-invitation">
      <div><p class="eyebrow">03 / EXPERIMENTAL ZONE</p><h2>下一次突破，<br />从一次实验开始。</h2><p>一些交互实验、未命名的灵感，以及下一次尝试。</p></div>
      <RouterLink to="/lab" class="invitation-link"><FlaskConical :size="27" :stroke-width="1.2" /><span>去狐狸实验室看看<small>Small experiments. New possibilities.</small></span><ArrowUpRight :size="21" /></RouterLink>
    </section>
    <div class="home-colophon"><span><BookOpen :size="13" /> 记录所学</span><span><Code2 :size="13" /> 创造所想</span><a href="https://github.com/DanoAndHolidays" target="_blank" rel="noreferrer"><Github :size="13" /> 保持开放 <ArrowUpRight :size="12" /></a></div>
  </div>
</template>

<style scoped>
.home { width: min(100% - 6rem, 82rem); margin: auto; }

.garden-hero { position: relative; display: flex; flex-direction: column; justify-content: center; min-height: 740px; padding: 85px 0 115px; color: #ecf0e8; isolation: isolate; }
.scene-layer { position: absolute; z-index: -1; top: -88px; bottom: 0; left: calc(50% - 50vw); width: 100vw; overflow: hidden; }
.scene-layer .ascii-scene { inset: 0; }
.scene-scrim { position: absolute; inset: 0; background: linear-gradient(90deg, #080c10f2 0%, #080c10c7 28%, #080c1042 60%, #080c101a 100%), linear-gradient(0deg, #080c10 0%, transparent 35%, #080c1030 100%); }
.scene-grid { position: absolute; inset: 0; opacity: .12; background-image: linear-gradient(#c9e2ea20 1px, transparent 1px), linear-gradient(90deg, #c9e2ea20 1px, transparent 1px); background-size: 80px 80px; mask-image: linear-gradient(90deg, #000, transparent 70%); }
.hero-coordinate { position: absolute; inset: 27px 0 auto; display: flex; justify-content: space-between; gap: 15px; font: 9px var(--font-mono); letter-spacing: .09em; color: #a4b3ba; }
.hero-coordinate > span { display: flex; align-items: center; gap: 9px; }
.hero-coordinate i { width: 5px; height: 5px; background: #cdfa81; box-shadow: 0 0 8px #cdfa8155; }
.hero-copy { max-width: 730px; }
.hero-eyebrow { display: flex; align-items: center; gap: 10px; font: 10px var(--font-mono); letter-spacing: .12em; color: #c7d1d4; }
.hero-eyebrow > span { height: 1px; width: 22px; background: #cdfa81; }
.hero-copy h1 { margin: 25px 0 0; font-family: var(--font-sans); font-size: clamp(64px, 8.5vw, 124px); font-weight: 650; line-height: .95; letter-spacing: -.065em; }
.hero-copy h1 > span { color: #e2e9e9; }
.hero-copy h1 b { font-weight: 400; color: #cdfa81; }
.hero-english { margin: 28px 0 0; font-size: 23px; font-weight: 400; letter-spacing: .07em; color: #e0e7e8; }
.hero-description { margin: 18px 0 0; max-width: 460px; font-size: 13px; line-height: 2; color: #9fadb4; }
.hero-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 30px; margin-top: 30px; }
.garden-button { display: inline-flex; align-items: center; gap: 32px; padding: 14px 21px; border: 1px solid #cdfa81; border-radius: 2px; background: #cdfa81; color: #17200e; font-size: 13px; font-weight: 550; transition: background .2s, box-shadow .2s; }
.garden-button:hover { background: #e0ffb0; box-shadow: 0 0 28px #cdfa8122; }
.text-link { display: inline-flex; align-items: center; gap: 13px; font-size: 12px; color: var(--ink-soft); white-space: nowrap; transition: color .2s; }
.text-link:hover { color: var(--ember); }
.hero-actions .text-link { color: #d7dfe0; }
.hero-actions .text-link:hover { color: #cdfa81; }
.hero-current { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 30px; font-size: 10px; color: #95a7ae; }
.status-dot { width: 5px; height: 5px; background: #b9e77e; margin-right: 2px; }
.hero-current__sep { color: #46575f; margin-inline: 3px; }
.scene-caption { position: absolute; right: 3%; bottom: 165px; display: grid; gap: 12px; font: 16px/1.3 var(--font-mono); color: #f2f2e6; letter-spacing: -.03em; text-shadow: 0 2px 15px #000; }
.scene-cross { font: 38px/1 var(--font-mono); color: #d3dfd9; margin-bottom: 20px; }
.scene-caption small { font: 8px/1.8 var(--font-mono); color: #a4b1b7; letter-spacing: .1em; }
.hero-bottom { position: absolute; bottom: 25px; left: 0; right: 0; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.hero-scroll { display: flex; align-items: center; gap: 9px; color: #a4b2b8; font-size: 11px; }
.hero-scroll span { font: 8px var(--font-mono); letter-spacing: .09em; margin-left: 4px; opacity: .7; }
.scene-controls { display: flex; align-items: center; gap: 6px; padding: 5px; border: 1px solid #a3bcc42b; border-radius: 3px; background: #090e13b8; backdrop-filter: blur(14px); }
.scene-control-group { display: flex; gap: 2px; padding-right: 6px; border-right: 1px solid #a3bcc424; }
.scene-controls button { height: 30px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0 10px; color: #a5b5bd; border: 1px solid transparent; border-radius: 2px; background: transparent; cursor: pointer; font-size: 11px; transition: color .2s, background .2s; }
.scene-controls button:hover { color: #e5eef0; }
.scene-controls button[aria-pressed="true"] { background: #d6e7ee12; color: #dce7e9; border-color: #d6e7ee0d; }
.scene-controls .glitch-control[aria-pressed="true"] { color: #cdfa81; }
.glitch-control i { width: 4px; height: 4px; background: currentColor; }
.scene-controls button:disabled { cursor: default; opacity: .45; }
.scene-controls .motion-control { padding: 0 7px; }
.garden-stats { display: grid; grid-template-columns: repeat(4, 1fr); border-block: 1px solid var(--line); padding: 30px 0; }
.garden-stat { display: flex; flex-direction: column; padding-left: 30px; border-left: 1px solid var(--line); }
.garden-stat:first-child { padding-left: 0; border: 0; }
.garden-stat__value { display: flex; align-items: start; gap: 13px; font: 400 39px/1.2 var(--font-mono); letter-spacing: -.045em; color: var(--ink); }
.garden-stat__value i { font: 14px var(--font-sans); color: var(--ember); margin-top: 5px; }
.garden-stat__label { margin-top: 10px; font-size: 12px; color: var(--ink-soft); }
.micro-label { font: 8px/1.6 var(--font-mono); letter-spacing: .12em; color: var(--muted); }
.garden-stat > .micro-label { margin-top: 5px; opacity: .8; }
.garden-section { padding-top: 90px; scroll-margin-top: 110px; }
.section-heading { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 34px; }
.section-heading h2 { font-size: clamp(24px, 2.5vw, 35px); margin-top: 16px; letter-spacing: -.055em; line-height: 1.5; }
.section-heading h2 span { color: var(--muted); }
.section-heading > .text-link { padding-bottom: 7px; }
.notes-layout { display: grid; grid-template-columns: 1.7fr 1fr; gap: 60px; }
.note-row { display: flex; gap: 22px; padding: 24px 0; border-top: 1px solid var(--line); }
.note-row:last-child { border-bottom: 1px solid var(--line); }
.note-row__index { color: var(--faint); font: 10px var(--font-mono); padding-top: 6px; }
.note-row__body { min-width: 0; flex: 1; }
.note-row__meta { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; font-size: 10px; color: var(--muted); }
.note-row h3 { margin-top: 12px; font-family: var(--font-sans); font-size: 18px; line-height: 1.5; font-weight: 500; overflow-wrap: anywhere; transition: color .2s; }
.note-row:hover h3, .note-row:hover > svg { color: var(--ember); }
.note-row__body > p { color: var(--muted); font-size: 12px; line-height: 1.9; margin-top: 7px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.note-row__tags { display: block; margin-top: 12px; font: 9px var(--font-mono); color: var(--muted); }
.note-row__arrow { flex-shrink: 0; margin-top: 38px; color: var(--muted); transition: color .2s, transform .2s; }
.note-row:hover > svg { transform: translate(2px, -2px); }
.notes-empty { padding: 60px 20px; color: var(--muted); border-block: 1px solid var(--line); }
.notes-empty h3 { margin: 20px 0 10px; font-size: 24px; color: var(--ink); }
.garden-fieldnote { align-self: start; background: var(--fieldnote); color: #e1eaed; padding: 29px; border-radius: 3px; overflow: hidden; }
.fieldnote-top { display: flex; align-items: center; justify-content: space-between; }
.fieldnote-top .micro-label { color: #9cb2bd; }
.fieldnote-top svg { color: #c7ef92; }
.fieldnote-art { position: relative; height: 142px; width: 140px; margin: 22px auto; }
.fieldnote-art i { position: absolute; inset: 10px 32px; border: 1px solid #95c9d4; opacity: .5; border-radius: 50%; transform: rotate(-38deg); }
.fieldnote-art i:nth-child(2) { transform: rotate(38deg); }
.fieldnote-art i:nth-child(3) { transform: rotate(90deg); }
.fieldnote-art span { position: absolute; top: 38px; left: 48px; color: #c7ef92; font-size: 46px; font-family: Georgia, serif; }
.garden-fieldnote h3 { font-size: 28px; line-height: 1.5; letter-spacing: -.04em; }
.garden-fieldnote > p { font-size: 12px; line-height: 2; color: #a0b5bc; margin-top: 17px; }
.fieldnote-stages { display: grid; gap: 11px; border-block: 1px solid #ffffff20; padding: 20px 0; margin-top: 23px; }
.fieldnote-stages > div { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #b6c6ca; }
.fieldnote-stages span { display: inline-flex; align-items: center; gap: 8px; }
.fieldnote-stages i { width: 5px; height: 5px; border-radius: 50%; background: #b8cb9f; }
.fieldnote-stages i.growing { background: #d5b97b; }
.fieldnote-stages i.seedling { background: #d19d7e; }
.fieldnote-stages b { font: 12px var(--font-mono); }
.fieldnote-link { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 11px; margin-top: 20px; color: #d0e5ed; }
.project-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
.project-card { min-width: 0; }
.project-art { position: relative; height: 245px; overflow: hidden; border-radius: 3px; transition: transform .5s; }
.project-card:hover .project-art { transform: translateY(-4px); }
.project-art__label, .project-art__number { position: absolute; top: 17px; left: 19px; font: 9px var(--font-mono); letter-spacing: .07em; opacity: .65; }
.project-art__number { left: auto; right: 19px; }
.project-art--yike { background: #222c34; color: #b4c8d6; }
.project-art--test { background: #182c2b; color: #a3c8c0; }
.project-art--playlet { background: #252633; color: #c2bed5; }
.art-player { position: absolute; width: 135px; left: calc(50% - 67px); top: 52px; padding: 7px; border-radius: 14px; background: #342e28; color: #f3e4ca; box-shadow: 14px 22px 30px #38291925; transform: rotate(-8deg); }
.art-player__screen { height: 119px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(145deg, #a4714f, #4c4740 65%, #879384); border-radius: 9px; }
.art-player__screen span { font: 31px var(--font-serif); letter-spacing: .05em; }
.art-player__screen i { font-style: normal; font-size: 15px; align-self: end; }
.art-player__line { height: 2px; margin-top: 10px; background: linear-gradient(to right, #d0a788 45%, #ffffff20 45%); }
.art-player > span { display: block; font: italic 8px Georgia, serif; padding: 9px 0 4px; }
.art-chart { position: absolute; inset: 65px 25px 22px; }
.art-chart > span { display: flex; justify-content: space-between; font: 7px var(--font-mono); letter-spacing: .1em; opacity: .7; }
.art-chart svg { width: 100%; height: 93px; margin-top: 8px; overflow: visible; }
.chart-grid { fill: none; stroke: #a3c8c015; stroke-width: 1; }
.chart-curve { fill: none; stroke: #567e69; stroke-width: 2; }
.art-chart b { display: block; font: 20px var(--font-serif); margin-top: 7px; }
.art-chart small { font: 9px var(--font-sans); float: right; margin-top: 10px; opacity: .6; }
.art-playlet { position: absolute; inset: 49px 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 13px; }
.art-playlet__circle { display: grid; place-items: center; width: 87px; height: 87px; border: 1px solid #82739860; border-radius: 50%; font: 46px Georgia, serif; outline: 1px solid #82739820; outline-offset: 9px; }
.art-playlet b { font: 22px Georgia, serif; letter-spacing: .09em; text-align: center; }
.art-playlet b span { display: block; font: 7px var(--font-mono); letter-spacing: .19em; margin-top: 7px; opacity: .65; }
.project-card__body { padding: 19px 0 0; }
.project-card__body > div { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.project-card h3 { font: 500 17px var(--font-sans); letter-spacing: -.02em; }
.project-card__body svg { color: var(--muted); transition: color .2s; }
.project-card:hover h3, .project-card:hover svg { color: var(--ember); }
.project-card p { margin-top: 9px; font-size: 12px; color: var(--muted); line-height: 1.8; }
.project-card__tech { display: block; margin-top: 17px; padding-top: 13px; border-top: 1px solid var(--line); font: 9px var(--font-mono); color: var(--muted); }
.garden-invitation { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 60px; border-block: 1px solid var(--line); padding: 46px 0; margin-top: 90px; }
.garden-invitation h2 { font-size: clamp(25px, 2.6vw, 36px); line-height: 1.6; margin: 16px 0; letter-spacing: -.04em; }
.garden-invitation p:not(.eyebrow) { font-size: 13px; color: var(--muted); }
.invitation-link { display: flex; align-items: center; gap: 22px; border: 1px solid var(--line); border-radius: 3px; padding: 30px 26px; color: var(--garden); background: var(--paper-2); transition: background .3s, border-color .3s; }
.invitation-link:hover { background: var(--paper); border-color: var(--garden); }
.invitation-link > span { font-size: 14px; flex: 1; }
.invitation-link small { display: block; margin-top: 7px; font: italic 12px Georgia, serif; color: var(--muted); }
.home-colophon { display: flex; align-items: center; justify-content: center; gap: 40px; padding-top: 34px; font-size: 11px; color: var(--muted); }
.home-colophon > * { display: flex; align-items: center; gap: 8px; }

@media (min-width: 1500px) { .garden-hero { min-height: 810px; } }
@media (max-width: 1100px) { .home { width: calc(100% - 3rem); } .garden-hero { min-height: 710px; } .notes-layout { gap: 30px; } .project-grid { gap: 20px; } .scene-caption { right: 0; font-size: 13px; } }
@media (max-width: 760px) {
  .garden-hero { min-height: 790px; padding-top: 105px; padding-bottom: 175px; justify-content: start; }
  .scene-layer { top: -72px; }
  .scene-layer .ascii-scene { left: -65%; width: 180%; }
  .scene-scrim { background: linear-gradient(90deg, #080c10d9, #080c1080), linear-gradient(0deg, #080c10, transparent 55%, #080c1033); }
  .hero-coordinate { top: 22px; font-size: 8px; }
  .hero-coordinate > span:last-child { display: none; }
  .hero-copy h1 { font-size: clamp(62px, 12.4vw, 94px); margin-top: 28px; }
  .hero-eyebrow { font-size: 8px; letter-spacing: .055em; }
  .hero-english { font-size: 20px; margin-top: 24px; letter-spacing: .035em; }
  .hero-description { font-size: 12px; max-width: 345px; }
  .hero-current { font-size: 9px; }
  .hero-current__sep, .hero-current > span:last-child { display: none; }
  .hero-actions { gap: 22px; }
  .scene-caption { right: 0; bottom: 155px; font-size: 11px; opacity: .8; }
  .scene-caption .scene-cross { display: none; }
  .scene-caption small { font-size: 7px; }
  .hero-bottom { flex-direction: column-reverse; align-items: start; gap: 22px; bottom: 24px; }
  .scene-controls { max-width: 100%; gap: 4px; padding: 4px; }
  .scene-controls button { padding: 0 8px; font-size: 10px; }
  .garden-stats { grid-template-columns: repeat(2, 1fr); row-gap: 25px; padding: 26px 0; }
  .garden-stat { padding-left: 24px; }
  .garden-stat:nth-child(3) { padding-left: 0; border-left: 0; }
  .garden-stat__value { font-size: 34px; }
  .garden-section { padding-top: 58px; }
  .section-heading { align-items: start; gap: 15px; flex-wrap: wrap; margin-bottom: 25px; }
  .section-heading h2 { font-size: 26px; }
  .section-heading > .text-link { padding: 0; font-size: 11px; }
  .notes-layout { grid-template-columns: 1fr; gap: 28px; }
  .garden-fieldnote { padding: 28px; }
  .fieldnote-art { float: right; margin: 40px 0 0; transform: scale(.85); }
  .garden-fieldnote h3 { margin-top: 28px; }
  .project-grid { grid-template-columns: 1fr; gap: 32px; }
  .project-art { height: 265px; }
  .art-player { top: 62px; }
  .art-chart { inset: 65px 30px 24px; }
  .art-chart svg { height: 110px; }
  .garden-invitation { grid-template-columns: 1fr; gap: 28px; margin-top: 58px; padding-block: 35px; }
  .invitation-link { padding: 24px; gap: 16px; }
}
@media (max-width: 420px) { .home { width: calc(100% - 2.5rem); } .scene-controls button { padding-inline: 6px; } .section-heading h2 { font-size: 23px; } .note-row { gap: 13px; } .note-row h3 { font-size: 17px; } .home-colophon { gap: 20px; font-size: 9px; } .fieldnote-art { width: 115px; margin-right: -12px; } .hero-coordinate { font-size: 7px; } }
@media (prefers-reduced-motion: reduce) { .project-card:hover .project-art { transform: none; } }
</style>

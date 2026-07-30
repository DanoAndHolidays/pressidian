<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import contentIndex from '../data/content-index.json'

const menuOpen = ref(false)
const dark = ref(false)

const recentNotes = computed(() =>
  [...contentIndex]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 4),
)

const statusMeta = {
  evergreen: { icon: '🌿', label: '常青笔记' },
  growing: { icon: '🌾', label: '生长中' },
  seedling: { icon: '🌱', label: '幼苗' },
}

const projects = [
  {
    id: '01',
    focus: '交互与性能',
    title: '一刻短剧 Yike',
    description: '高仿抖音的短剧 SPA，以“播一预一”机制优化滑动、预加载与播放体验。',
    tech: 'Vue 3 · Vite · Pinia · Express',
    href: 'https://danoandholidays.github.io/yike/',
  },
  {
    id: '02',
    focus: '数据与可视化',
    title: '深岩智测',
    description: '将煤岩损伤预测结果转化为清晰、可行动的数据可视化界面。',
    tech: 'Vue 3 · ECharts · TailwindCSS',
    href: 'https://danoandholidays.github.io/test/#/',
  },
  {
    id: '03',
    focus: '移动端实验',
    title: 'PLAYLET-APP',
    description: '围绕移动端竖屏播放体验进行的一次早期应用原型探索。',
    tech: 'JavaScript · HTML5 · CSS3',
    href: 'https://danoandholidays.github.io/PLAYLET-APP/',
  },
]

const closeMenu = () => {
  menuOpen.value = false
}
</script>

<template>
  <main class="garden-home" :class="{ 'is-dark': dark }">
    <div class="garden-shell">
      <nav class="garden-nav" aria-label="主导航">
        <RouterLink class="garden-brand" to="/" aria-label="Pressidian 首页">
          <svg class="fox-mark" viewBox="0 0 48 48" aria-hidden="true">
            <path d="m8 11 10 7h12l10-7-3 19-13 10L11 30 8 11Z" />
            <path class="fox-mark-face" d="m16 25 8 4 8-4-3 9-5 4-5-4-3-9Z" />
            <path class="fox-mark-eye" d="M16 24h4v3h-4zm12 0h4v3h-4zM22 32h4v3h-4z" />
          </svg>
          <span>Pressidian</span>
        </RouterLink>

        <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-label="切换导航" @click="menuOpen = !menuOpen">
          <span></span><span></span>
        </button>

        <div class="garden-links" :class="{ open: menuOpen }">
          <RouterLink to="/" @click="closeMenu">花园入口</RouterLink>
          <RouterLink to="/notes/" @click="closeMenu">最近栽种</RouterLink>
          <RouterLink to="/projects/" @click="closeMenu">项目路径</RouterLink>
          <RouterLink to="/about/" @click="closeMenu">关于 Dano</RouterLink>
          <RouterLink to="/lab/" @click="closeMenu">狐狸实验室</RouterLink>
        </div>

        <div class="garden-actions">
          <button class="theme-toggle" type="button" :aria-label="dark ? '切换亮色模式' : '切换深色模式'" @click="dark = !dark">
            {{ dark ? '☀' : '☾' }}
          </button>
          <RouterLink class="search-button" to="/notes/" aria-label="搜索笔记">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg>
          </RouterLink>
        </div>
      </nav>

      <section class="hero-section">
        <div class="hero-copy">
          <p class="eyebrow">DANO · FRONTEND ENGINEER · DIGITAL GARDENER</p>
          <h1>让作品与想法，<br />一起<span>生长。</span></h1>
          <p class="hero-intro">我是 Dano，一名前端开发者。这里统一收录我的项目、经历和持续修剪的技术笔记；狐狸会守着这座花园，提醒我保持好奇。</p>
          <div class="hero-actions">
            <RouterLink class="primary-button" to="/about/">从这里认识我 <b>↗</b></RouterLink>
            <RouterLink class="text-button" to="/notes/">随便逛逛 →</RouterLink>
          </div>
        </div>

        <div class="knowledge-map" aria-label="个人知识地图">
          <svg class="map-lines" viewBox="0 0 470 390" aria-hidden="true">
            <g fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 7">
              <path d="M68 74 232 190 412 72M232 190 72 326M232 190 402 324M68 74 72 326M412 72 402 324" />
            </g>
          </svg>
          <RouterLink class="map-node node-project" to="/projects/"><span>项目</span><small>03</small></RouterLink>
          <RouterLink class="map-node node-notes" to="/notes/"><span>前端笔记</span><small>{{ contentIndex.length }}</small></RouterLink>
          <RouterLink class="map-node node-lab" to="/lab/"><span>实验</span><small>LAB</small></RouterLink>
          <RouterLink class="map-node node-about" to="/about/"><span>经历</span><small>03</small></RouterLink>
          <RouterLink class="fox-node" to="/about/" aria-label="Dano 的狐狸向导">
            <svg viewBox="0 0 130 130" aria-hidden="true">
              <path class="fox-ear" d="m17 23 29 20h38l29-20-8 64-40 30-40-30-8-64Z" />
              <path class="fox-cheek" d="m34 66 31 17 31-17-11 33-20 15-20-15-11-33Z" />
              <path class="fox-detail" d="M39 62h13v8H39zm39 0h13v8H78zM59 88h12v8H59z" />
            </svg>
            <span>Dano's<br />garden</span>
          </RouterLink>
          <div class="fox-tail" aria-hidden="true"></div>
        </div>
      </section>

      <section class="garden-status" aria-label="花园同步状态">
        <span class="healthy"><i></i>狐狸巡检完成 · 内容已同步</span>
        <span>{{ contentIndex.length }} 篇笔记 · 3 个项目 · 自动构建开启</span>
        <span>SHANGHAI · {{ new Date().getFullYear() }}</span>
      </section>

      <section class="garden-content">
        <div class="recent-notes">
          <div class="section-heading">
            <div><p>RECENTLY TENDED</p><h2>最近打理的笔记</h2></div>
            <RouterLink to="/notes/">查看全部笔记 →</RouterLink>
          </div>

          <div class="note-grid">
            <RouterLink v-for="(note, index) in recentNotes" :key="note.path" class="note-card" :class="`card-${index + 1}`" :to="note.path">
              <div class="note-meta">
                <span>{{ statusMeta[note.status]?.icon || '🌱' }} {{ statusMeta[note.status]?.label || '幼苗' }}</span>
                <span>{{ note.tags?.[0] || 'NOTE' }}</span>
              </div>
              <h3>{{ note.title }}</h3>
              <p>{{ note.description }}</p>
              <footer><span>{{ note.readingTime || 5 }} 分钟</span><span>{{ note.date }}</span></footer>
            </RouterLink>

            <RouterLink v-if="recentNotes.length < 2" class="note-card card-placeholder" to="/notes/">
              <div class="note-meta"><span>🦊 狐狸的空地</span><span>NEXT</span></div>
              <h3>下一篇笔记<br />会在这里发芽</h3>
              <p>同步新的 Obsidian 笔记后，这块空地会自动长出内容。</p>
              <footer><span>等待栽种</span><span>→</span></footer>
            </RouterLink>
          </div>
        </div>

        <aside class="garden-rail">
          <div class="rail-block">
            <p class="rail-title">沿着主题逛</p>
            <RouterLink class="topic-link" to="/notes/"><span>Vue 与生态</span><small>前端核心</small></RouterLink>
            <RouterLink class="topic-link" to="/notes/"><span>JavaScript</span><small>语言基础</small></RouterLink>
            <RouterLink class="topic-link" to="/notes/"><span>工程与工具</span><small>构建发布</small></RouterLink>
            <RouterLink class="topic-link" to="/notes/"><span>设计与体验</span><small>交互视觉</small></RouterLink>
          </div>

          <div class="fox-note">
            <svg viewBox="0 0 64 64" aria-hidden="true"><path d="m8 11 15 11h18l15-11-5 35-19 14-19-14L8 11Z"/><path class="light" d="m18 35 14 8 14-8-5 15-9 7-9-7-5-15Z"/><path class="dark" d="M20 31h7v5h-7zm17 0h7v5h-7zM29 44h6v5h-6z"/></svg>
            <p>狐狸正在研究</p>
            <h3>Pressidian 2.0</h3>
            <span>自动同步的个人知识发布系统</span>
            <i class="progress"><b></b></i>
          </div>

          <div class="growth-legend">
            <p class="rail-title">生长阶段</p>
            <span><i>🌱 幼苗</i>刚刚记下的想法</span>
            <span><i>🌾 生长中</i>正在持续补充</span>
            <span><i>🌿 常青</i>经过反复整理</span>
          </div>
        </aside>
      </section>

      <section class="project-section">
        <div class="section-heading">
          <div><p>SELECTED WORK</p><h2>从花园里长出的项目</h2></div>
          <a href="https://github.com/DanoAndHolidays" target="_blank" rel="noreferrer">去 GitHub 看看 →</a>
        </div>
        <div class="project-grid">
          <a v-for="project in projects" :key="project.id" class="project-card" :href="project.href" target="_blank" rel="noreferrer">
            <div class="project-index"><span>{{ project.id }} · {{ project.focus }}</span><b>↗</b></div>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <small>{{ project.tech }}</small>
          </a>
        </div>
      </section>

      <section class="profile-strip">
        <div><small>CURRENTLY</small><strong>字节跳动 · 前端开发实习生</strong></div>
        <div><small>OPEN SOURCE</small><strong>Vite DevTools · 贡献者</strong></div>
        <div><small>EDUCATION</small><strong>中国矿业大学 · 计算机科学与技术</strong></div>
        <RouterLink to="/about/">完整经历 ↗</RouterLink>
      </section>

      <footer class="garden-footer">
        <span>在上海写代码，也照料想法。</span>
        <div><a href="https://github.com/DanoAndHolidays" target="_blank" rel="noreferrer">GitHub</a><a href="https://space.bilibili.com/111616585" target="_blank" rel="noreferrer">Bilibili</a><a href="mailto:Danoday@Foxmail.com">Email</a></div>
        <span>© {{ new Date().getFullYear() }} Dano & Fox</span>
      </footer>
    </div>
  </main>
</template>

<style scoped>
*{box-sizing:border-box}.garden-home{--canvas:#f3f0e8;--paper:#fcfaf5;--ink:#23231f;--forest:#24251f;--forest-soft:#3f423a;--orange:#f0642f;--orange-dark:#b84924;--orange-pale:#f6ddd0;--sage:#e5e3da;--line:#d8d3c7;--muted:#77766f;min-height:100vh;background:var(--canvas);color:var(--ink);font-family:"Avenir Next",Inter,"PingFang SC","Microsoft YaHei",sans-serif;background-image:radial-gradient(color-mix(in srgb,var(--muted) 27%,transparent) .6px,transparent .6px);background-size:17px 17px;transition:background .25s,color .25s}.garden-home.is-dark{--canvas:#141412;--paper:#1c1c19;--ink:#f3efe6;--forest:#20211d;--forest-soft:#34362f;--orange:#ff7440;--orange-dark:#ffb08c;--orange-pale:#3a2921;--sage:#252720;--line:#35362f;--muted:#a6a49b}.garden-shell{width:min(100% - 52px,1340px);margin:auto}.garden-nav{height:92px;display:flex;align-items:center;gap:42px}.garden-brand{display:flex;align-items:center;gap:10px;color:var(--ink);font:600 25px Georgia,"Songti SC",serif;text-decoration:none}.is-dark .garden-brand{color:var(--ink)}.fox-mark{width:31px;height:31px;fill:var(--orange)}.fox-mark-face{fill:var(--paper)}.fox-mark-eye{fill:var(--ink)}.garden-links{display:flex;gap:25px}.garden-links a{color:var(--ink);font-size:13px;text-decoration:none;padding:8px 0;border-bottom:1px solid transparent}.garden-links a:hover,.garden-links a.router-link-active{color:var(--orange);border-color:var(--orange)}.garden-actions{margin-left:auto;display:flex;gap:9px}.theme-toggle,.search-button{width:39px;height:39px;border:1px solid var(--line);border-radius:99px;background:color-mix(in srgb,var(--paper) 75%,transparent);color:var(--ink);display:grid;place-items:center;cursor:pointer}.search-button svg{width:16px}.theme-toggle:hover,.search-button:hover{border-color:var(--orange);color:var(--orange)}.menu-toggle{display:none}
.hero-section{position:relative;min-height:525px;background:var(--forest);color:#f8f5ed;border-radius:26px 26px 105px 26px;overflow:hidden;padding:66px 52px;display:grid;grid-template-columns:1.23fr .77fr;gap:38px}.hero-section:after{display:none}.eyebrow{font-size:10px;letter-spacing:.15em;color:#bfc1b8;margin:0}.hero-copy h1{font:400 clamp(55px,6.8vw,96px)/.98 Georgia,"Songti SC",serif;letter-spacing:-.055em;margin:22px 0}.hero-copy h1 span{color:#ff7845;font-style:italic}.hero-intro{max-width:600px;color:#d4d5cf;line-height:1.8;font-size:15px;margin:0}.hero-actions{display:flex;align-items:center;gap:22px;margin-top:28px}.primary-button{display:inline-flex;align-items:center;gap:13px;color:#1e1c18;background:#ff7845;border-radius:99px;padding:13px 18px;text-decoration:none;font-size:13px;font-weight:650}.primary-button:hover{background:#ff9167;transform:translateY(-2px)}.text-button{color:#f3efe6;text-decoration:none;font-size:12px;border-bottom:1px solid #6e7168;padding-bottom:3px}.knowledge-map{position:relative;min-height:370px}.map-lines{position:absolute;inset:0;width:100%;height:100%;color:#62665d}.map-node{position:absolute;background:#f8f5ed;color:#23231f;border-radius:50%;display:grid;place-items:center;text-align:center;text-decoration:none;box-shadow:0 10px 28px rgba(0,0,0,.18);font:12px/1.2 Georgia,"Songti SC",serif;transition:transform .2s}.map-node small{display:block;font:8px "Avenir Next",sans-serif;color:var(--orange)}.map-node:hover{transform:translateY(-4px) rotate(2deg)}.node-project{width:76px;height:76px;left:2%;top:8%}.node-notes{width:83px;height:83px;right:0;top:6%}.node-lab{width:67px;height:67px;left:3%;bottom:6%}.node-about{width:72px;height:72px;right:5%;bottom:4%}.fox-node{position:absolute;width:126px;height:126px;left:35%;top:31%;border-radius:50%;background:#f8f5ed;display:grid;place-items:center;text-decoration:none;box-shadow:0 13px 36px rgba(0,0,0,.22)}.fox-node svg{position:absolute;width:82px;height:82px;top:9px}.fox-ear{fill:var(--orange)}.fox-cheek{fill:#fff4e8}.fox-detail{fill:#23231f}.fox-node span{position:absolute;bottom:9px;color:#23231f;font:8px/1.2 "Avenir Next",sans-serif;text-align:center;text-transform:uppercase;letter-spacing:.06em}.fox-tail{position:absolute;right:3%;top:43%;width:47px;height:88px;background:var(--orange);border-radius:70% 30% 70% 30%;transform:rotate(28deg);opacity:.92}.fox-tail:after{content:"";position:absolute;right:0;bottom:0;width:25px;height:28px;background:#f8f5ed;border-radius:0 0 80% 20%}
.garden-status{min-height:54px;display:flex;align-items:center;justify-content:space-between;padding:0 6px;color:var(--muted);font-size:11px}.healthy{color:var(--forest);display:flex;align-items:center;gap:9px}.is-dark .healthy{color:var(--orange)}.healthy i{width:8px;height:8px;background:var(--orange);border-radius:50%;box-shadow:0 0 0 4px color-mix(in srgb,var(--orange) 18%,transparent)}
.garden-content{display:grid;grid-template-columns:1.45fr .7fr;gap:50px;padding:48px 0 76px}.section-heading{display:flex;align-items:end;justify-content:space-between;margin-bottom:21px}.section-heading p{font-size:9px;letter-spacing:.15em;color:var(--orange);margin:0 0 8px;font-weight:700}.section-heading h2{font:400 35px Georgia,"Songti SC",serif;margin:0;letter-spacing:-.035em;color:var(--ink)}.section-heading>a{font-size:11px;color:var(--orange);text-decoration:none;border-bottom:1px solid var(--orange);padding-bottom:3px}.note-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}.note-card{min-height:245px;padding:25px;background:color-mix(in srgb,var(--paper) 90%,transparent);border:1px solid var(--line);border-radius:16px;display:flex;flex-direction:column;text-decoration:none;color:var(--ink);transition:.2s ease}.note-card:hover{transform:translateY(-4px);box-shadow:0 14px 35px rgba(55,66,45,.1);border-color:var(--orange)}.note-card.card-2{background:var(--orange-pale)}.note-card.card-3{background:var(--sage)}.note-card.card-4{background:color-mix(in srgb,var(--orange-pale) 50%,var(--paper))}.card-placeholder{border-style:dashed;background:transparent}.note-meta{display:flex;justify-content:space-between;color:var(--muted);font-size:9px;letter-spacing:.05em;text-transform:uppercase}.note-card h3{font:400 23px/1.28 Georgia,"Songti SC",serif;margin:25px 0 12px;letter-spacing:-.025em}.note-card p{color:var(--muted);font-size:12px;line-height:1.65;margin:0}.note-card footer{margin-top:auto;color:var(--muted);font-size:9px;display:flex;justify-content:space-between;padding-top:20px}.garden-rail{padding-top:3px}.rail-block,.growth-legend{margin-bottom:34px}.rail-title{font-size:9px;letter-spacing:.13em;text-transform:uppercase;color:var(--orange);font-weight:700;margin:0 0 14px}.topic-link{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--line);text-decoration:none;color:var(--ink);font:17px Georgia,"Songti SC",serif}.topic-link:hover{color:var(--orange);padding-left:5px}.topic-link small{font:9px "Avenir Next",sans-serif;color:var(--muted)}.fox-note{padding:25px;background:var(--orange);color:#fffaf0;border-radius:16px 50px 16px 16px;margin-bottom:34px;position:relative;overflow:hidden}.fox-note svg{position:absolute;width:72px;height:72px;right:15px;top:13px;fill:#fff0dc;opacity:.28}.fox-note svg .light{fill:#fff}.fox-note svg .dark{fill:var(--orange-dark)}.fox-note p{font-size:9px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 24px}.fox-note h3{font:400 24px Georgia,"Songti SC",serif;margin:0 0 8px}.fox-note span{display:block;color:#ffe7d4;font-size:11px}.progress{display:block;height:7px;background:rgba(255,255,255,.22);margin-top:20px}.progress b{display:block;width:68%;height:100%;background:#fff5e8}.growth-legend{display:grid;gap:10px;color:var(--muted);font-size:11px}.growth-legend span{display:flex;justify-content:space-between}.growth-legend i{font-style:normal;color:var(--ink)}
.project-section{padding:0 0 76px}.project-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}.project-card{min-height:240px;border-radius:16px;padding:24px;background:var(--paper);border:1px solid var(--line);display:flex;flex-direction:column;text-decoration:none;color:var(--ink);transition:.2s}.project-card:nth-child(2){background:var(--sage)}.project-card:nth-child(3){background:var(--orange-pale)}.project-card:hover{transform:translateY(-5px);box-shadow:0 14px 35px rgba(55,66,45,.1)}.project-index{display:flex;justify-content:space-between;color:var(--muted);font-size:9px;letter-spacing:.06em}.project-index b{color:var(--orange)}.project-card h3{font:400 25px Georgia,"Songti SC",serif;margin:31px 0 12px}.project-card p{color:var(--muted);font-size:12px;line-height:1.65;margin:0}.project-card small{margin-top:auto;padding-top:18px;color:var(--orange-dark);font-size:9px;font-weight:650}.profile-strip{display:grid;grid-template-columns:repeat(3,1fr) auto;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-bottom:70px}.profile-strip>div{padding:22px;border-right:1px solid var(--line)}.profile-strip>div:first-child{padding-left:0}.profile-strip small{display:block;color:var(--orange);font-size:8px;letter-spacing:.12em;margin-bottom:8px}.profile-strip strong{font:400 15px Georgia,"Songti SC",serif}.profile-strip>a{align-self:center;color:var(--orange);font-size:10px;text-decoration:none;padding-left:22px}.garden-footer{border-top:1px solid var(--line);padding:28px 0 40px;display:flex;justify-content:space-between;color:var(--muted);font-size:10px}.garden-footer div{display:flex;gap:22px}.garden-footer a{color:var(--ink);text-decoration:none}.garden-footer a:hover{color:var(--orange)}
@media(max-width:900px){.garden-shell{width:min(100% - 28px,1340px)}.garden-nav{height:78px}.garden-links{position:absolute;z-index:20;top:69px;left:14px;right:14px;padding:16px;background:var(--paper);border:1px solid var(--line);border-radius:14px;display:none;flex-direction:column;gap:3px;box-shadow:0 15px 40px rgba(32,43,35,.14)}.garden-links.open{display:flex}.garden-links a{padding:11px}.menu-toggle{display:grid;gap:5px;width:35px;height:35px;background:transparent;border:0;place-content:center;cursor:pointer}.menu-toggle span{width:18px;height:1px;background:var(--ink)}.garden-actions{gap:6px}.hero-section{grid-template-columns:1fr;padding:48px 28px;border-radius:20px 20px 68px 20px}.hero-copy h1{font-size:56px}.knowledge-map{min-height:290px}.garden-status span:nth-child(2){display:none}.garden-content{grid-template-columns:1fr}.note-grid,.project-grid{grid-template-columns:1fr}.profile-strip{grid-template-columns:1fr}.profile-strip>div{padding:18px 0;border-right:0;border-bottom:1px solid var(--line)}.profile-strip>a{padding:18px 0}.garden-footer{gap:18px}.garden-footer>span:first-child{display:none}}
@media(max-width:430px){.garden-brand span{font-size:21px}.theme-toggle,.search-button{width:35px;height:35px}.hero-section{padding:42px 23px}.hero-copy h1{font-size:50px}.hero-actions{align-items:flex-start;flex-direction:column}.fox-node{left:32%;transform:scale(.9)}.section-heading h2{font-size:30px}.section-heading p{display:none}.section-heading>a{font-size:9px}.garden-status{font-size:9px}.garden-footer{font-size:9px}.garden-footer div{gap:12px}}
</style>

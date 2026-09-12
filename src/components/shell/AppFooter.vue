<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { CONTACTS, NAV_ITEMS, PROFILE } from '@/data/site'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="garden-footer">
    <div class="footer-main">
      <div class="footer-identity"><RouterLink to="/" class="footer-wordmark">Pressidian<span>®</span></RouterLink><p>在上海写代码，也照料想法。<br />一座属于 Dano 的、持续生长的数字花园。</p><span class="footer-signature">BUILT WITH CODE. DRIVEN BY CURIOSITY.</span></div>
      <nav aria-label="页脚导航"><p class="eyebrow">WANDER AROUND</p><RouterLink v-for="item in NAV_ITEMS" :key="item.key" :to="item.to">{{ item.label }}</RouterLink></nav>
      <div class="footer-contact"><p class="eyebrow">LET'S CONNECT</p><a v-for="contact in CONTACTS" :key="contact.label" :href="contact.href" target="_blank" rel="noreferrer"><span>{{ contact.label }}<b>{{ contact.value }}</b></span><ArrowUpRight :size="15" /></a></div>
    </div>
    <div class="footer-bottom"><span>© {{ year }} {{ PROFILE.name }} · Pressidian</span><span>保持好奇，慢慢生长。<i />{{ PROFILE.city }} · CN</span></div>
  </footer>
</template>

<style scoped>
.garden-footer { margin-top: 64px; border-top: 1px solid var(--line); background: var(--paper-2); }
.footer-main { width: min(100% - 6rem, 82rem); margin: auto; display: grid; grid-template-columns: 1.5fr .8fr 1fr; gap: 60px; padding: 50px 0 40px; }
.footer-wordmark { font: 500 27px var(--font-mono); letter-spacing: -.06em; }
.footer-wordmark span { font: 11px sans-serif; vertical-align: top; margin: 7px 0 0 4px; display: inline-block; }
.footer-identity p { margin-top: 20px; color: var(--muted); font-size: 12px; line-height: 2; }
.footer-signature { display: block; margin-top: 22px; font: 11px var(--font-mono); color: var(--muted); }
.footer-main .eyebrow { font-size: 10px; letter-spacing: .12em; margin-bottom: 20px; }
.footer-main nav a { display: block; font-size: 12px; color: var(--muted); margin-top: 10px; width: fit-content; }
.footer-main a { transition: color .2s; }
.footer-main a:hover { color: var(--ember); }
.footer-contact a { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--line); }
.footer-contact a > span { font: 9px var(--font-mono); color: var(--muted); }
.footer-contact b { display: block; font: 12px var(--font-sans); color: var(--ink-soft); margin-top: 6px; overflow-wrap: anywhere; }
.footer-contact svg { color: var(--muted); flex-shrink: 0; }
.footer-bottom { width: min(100% - 6rem, 82rem); margin: auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-top: 1px solid var(--line); padding: 22px 0; font-size: 10px; color: var(--muted); }
.footer-bottom > span:last-child { display: flex; align-items: center; gap: 15px; }
.footer-bottom i { width: 3px; height: 3px; background: var(--muted); border-radius: 50%; }
@media (max-width: 1100px) { .footer-main, .footer-bottom { width: calc(100% - 3rem); } .footer-main { gap: 32px; } }
@media (max-width: 640px) { .garden-footer { margin-top: 45px; } .footer-main, .footer-bottom { width: calc(100% - 2.5rem); } .footer-main { grid-template-columns: .8fr 1.2fr; gap: 35px 22px; padding-top: 35px; } .footer-identity { grid-column: 1 / -1; } .footer-wordmark { font-size: 32px; } .footer-main nav a, .footer-contact b { font-size: 11px; } }
</style>

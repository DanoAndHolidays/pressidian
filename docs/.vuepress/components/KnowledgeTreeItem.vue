<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  node: { type: Object, required: true },
  currentPath: { type: String, required: true },
  depth: { type: Number, default: 0 },
})

const containsCurrent = computed(() => props.node.paths?.includes(props.currentPath))
const open = ref(containsCurrent.value || props.depth === 0)

watch(containsCurrent, (active) => {
  if (active) open.value = true
})
</script>

<template>
  <li v-if="node.type === 'folder'" class="tree-folder" :class="{ open, active: containsCurrent }">
    <button type="button" :aria-expanded="open" @click="open = !open">
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 5 5-5 5" /></svg>
      <span>{{ node.label }}</span>
      <small>{{ node.paths.length }}</small>
    </button>
    <ul v-if="open">
      <KnowledgeTreeItem
        v-for="child in node.children"
        :key="child.path || `${child.label}-${depth}`"
        :node="child"
        :current-path="currentPath"
        :depth="depth + 1"
      />
    </ul>
  </li>
  <li v-else class="tree-note">
    <RouterLink :to="node.path" :class="{ current: node.path === currentPath }">
      <i aria-hidden="true"></i>
      <span>{{ node.label }}</span>
    </RouterLink>
  </li>
</template>

<style scoped>
ul{list-style:none;margin:0;padding:0}.tree-folder>button{width:100%;min-height:35px;display:grid;grid-template-columns:14px minmax(0,1fr) auto;align-items:center;gap:7px;padding:5px 10px 5px calc(12px + var(--tree-indent,0px));border:0;background:transparent;color:var(--c-text-mute);font:600 12px/1.35 inherit;text-align:left;cursor:pointer;border-radius:7px}.tree-folder>button:hover{color:var(--c-text);background:var(--c-bg-light)}.tree-folder>button svg{width:12px;fill:none;stroke:currentColor;stroke-width:1.6;transition:transform .18s}.tree-folder.open>button svg{transform:rotate(90deg)}.tree-folder.active>button{color:var(--c-accent)}.tree-folder>button span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tree-folder>button small{font-size:9px;font-weight:500;color:var(--c-text-mute);background:var(--c-bg-light);padding:1px 5px;border-radius:99px}.tree-folder ul{padding-left:10px}.tree-note a{position:relative;display:flex;align-items:flex-start;gap:9px;padding:7px 12px 7px 24px;border-radius:7px;color:var(--c-text-mute);font-size:12px;line-height:1.45;text-decoration:none}.tree-note a:hover{color:var(--c-text);background:var(--c-bg-light)}.tree-note a.current{color:var(--c-accent);background:var(--c-accent-bg);font-weight:650}.tree-note i{width:5px;height:5px;margin-top:6px;border:1px solid currentColor;border-radius:50%;flex:none}.tree-note a.current i{background:var(--c-accent)}
</style>

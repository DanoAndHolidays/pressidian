<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'
import KnowledgeSidebar from './KnowledgeSidebar.vue'

const route = useRoute()
const isNoteArticle = computed(() => /^\/notes\/.+/.test(route.path) && route.path !== '/notes/')
</script>

<template>
  <DefaultLayout>
    <template v-if="isNoteArticle" #sidebar-top>
      <KnowledgeSidebar />
    </template>
  </DefaultLayout>
</template>

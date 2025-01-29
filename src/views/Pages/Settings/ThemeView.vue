<script setup>
import { ref } from 'vue'
import ThemeSettings from '@/components/Settings/ThemeSettings.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'

const pageTitle = ref('Theme Settings')
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-270">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->
      <ThemeSettings />
    </div>
  </DefaultLayout>
</template>

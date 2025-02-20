<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import SettingsCard from '@/components/SettingsCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Credits from '@/components/Credits/Credits.vue'
const pageTitle = ref('Credits Page')
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-270">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->
      <Credits />
    </div>
  </DefaultLayout>
</template>

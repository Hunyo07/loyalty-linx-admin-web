<script setup>
import { ref } from 'vue'
import AccountSettings from '@/components/Settings/AccountSettings.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
const pageTitle = ref('Account Settings')
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-270">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->
      <AccountSettings />
    </div>
  </DefaultLayout>
</template>

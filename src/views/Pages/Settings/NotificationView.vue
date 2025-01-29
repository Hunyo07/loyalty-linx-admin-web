<script setup>
import { ref } from 'vue'
import NotificationSetting from '@/components/Settings/NotificationSetting.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';

const pageTitle = ref('Notification Settings')
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-270">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->
      <NotificationSetting />
    </div>
  </DefaultLayout>
</template>

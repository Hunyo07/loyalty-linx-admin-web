<script setup>
import { ref } from 'vue'
// import ProfileSetting from '@/components/Settings/ProfileSetting.vue'
import ProfileCard from '@/components/ProfileCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';

const pageTitle = ref('Profile Settings')
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-270">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->
      <ProfileCard />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { Toaster } from '@/components/ui/sonner'
import AppLayout from '@/components/layout/AppLayout.vue'

const authStore = useAuthStore()
authStore.initialize()
</script>

<template>
  <AppLayout v-if="authStore.isAuthenticated">
    <RouterView />
  </AppLayout>
  <RouterView v-else />
  <Toaster />
</template>

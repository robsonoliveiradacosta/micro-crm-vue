<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { Toaster } from '@/components/ui/sonner'

const authStore = useAuthStore()
authStore.initialize()
</script>

<template>
  <RouterView />
  <Toaster />
</template>

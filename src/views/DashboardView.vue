<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import { Skeleton } from '@/components/ui/skeleton'

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.fetchDashboard()
})
</script>

<template>
  <div class="p-6">
    <h1 class="mb-6 text-2xl font-bold">Dashboard</h1>

    <div v-if="dashboardStore.loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Skeleton v-for="i in 5" :key="i" class="h-28 w-full rounded-xl" />
    </div>

    <DashboardStats v-else-if="dashboardStore.data" :data="dashboardStore.data" />

    <div v-else class="text-muted-foreground py-12 text-center">
      <p>Nenhum dado disponível no momento.</p>
    </div>
  </div>
</template>

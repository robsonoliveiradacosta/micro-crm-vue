<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()
</script>

<template>
  <header class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
    <SidebarTrigger class="-ml-1" />
    <Separator orientation="vertical" class="mr-2 !h-4" />
    <div class="flex flex-1 items-center justify-end">
      <Button variant="ghost" size="sm" @click="authStore.logout()">
        <LogOut class="mr-2 size-4" />
        <span class="hidden sm:inline">Sair</span>
      </Button>
    </div>
  </header>
</template>

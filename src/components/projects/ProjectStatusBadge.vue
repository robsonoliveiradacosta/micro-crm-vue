<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS } from '@/lib/utils'
import type { ProjectStatus } from '@/types'

const props = defineProps<{ status: ProjectStatus }>()

const variant = computed(() => {
  switch (props.status) {
    case 'EM_ANDAMENTO':
      return 'default' // blue
    case 'CONCLUIDO':
      return 'default'
    case 'CANCELADO':
      return 'destructive'
    default:
      return 'secondary' // ORCAMENTO — yellow-ish
  }
})

const customClass = computed(() => {
  switch (props.status) {
    case 'EM_ANDAMENTO':
      return 'bg-blue-500 hover:bg-blue-500/80 text-white'
    case 'CONCLUIDO':
      return 'bg-green-500 hover:bg-green-500/80 text-white'
    case 'CANCELADO':
      return ''
    default:
      return 'bg-yellow-400 hover:bg-yellow-400/80 text-yellow-900'
  }
})
</script>

<template>
  <Badge :variant="variant" :class="customClass">
    {{ STATUS_LABELS[status] }}
  </Badge>
</template>

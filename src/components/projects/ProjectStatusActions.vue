<script setup lang="ts">
import { computed } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-vue-next'
import { STATUS_TRANSITIONS, STATUS_LABELS } from '@/lib/utils'
import type { Project, ProjectStatus } from '@/types'

const props = defineProps<{ project: Project }>()

const emit = defineEmits<{
  statusChange: [projectId: string, newStatus: ProjectStatus]
}>()

const transitions = computed(() => STATUS_TRANSITIONS[props.project.status])
</script>

<template>
  <DropdownMenu v-if="transitions.length > 0">
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm">
        Alterar Status
        <ChevronDown class="ml-1 h-3 w-3" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="status in transitions"
        :key="status"
        @click="emit('statusChange', project.id, status)"
      >
        {{ STATUS_LABELS[status] }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

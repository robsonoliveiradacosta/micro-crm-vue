<script setup lang="ts">
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import ProjectStatusBadge from './ProjectStatusBadge.vue'
import ProjectStatusActions from './ProjectStatusActions.vue'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Client, Project, ProjectStatus } from '@/types'

defineProps<{
  projects: Project[]
  clients: Client[]
}>()

const emit = defineEmits<{
  edit: [project: Project]
  delete: [project: Project]
  statusChange: [projectId: string, newStatus: ProjectStatus]
  create: []
}>()

const router = useRouter()

function clientName(clients: Client[], clientId: string): string {
  return clients.find((c) => c.id === clientId)?.name ?? '—'
}
</script>

<template>
  <div class="overflow-x-auto rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead class="hidden sm:table-cell">Cliente</TableHead>
          <TableHead class="hidden sm:table-cell">Valor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead class="hidden md:table-cell">Data Início</TableHead>
          <TableHead class="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty v-if="projects.length === 0" :colspan="6">
          <div class="py-8 text-center">
            <p class="text-muted-foreground mb-4 text-sm">Nenhum projeto encontrado</p>
            <Button size="sm" @click="emit('create')">Criar projeto</Button>
          </div>
        </TableEmpty>
        <TableRow v-for="project in projects" :key="project.id">
          <TableCell class="font-medium">{{ project.title }}</TableCell>
          <TableCell class="hidden sm:table-cell">{{ clientName(clients, project.clientId) }}</TableCell>
          <TableCell class="hidden sm:table-cell">{{ formatCurrency(project.value) }}</TableCell>
          <TableCell>
            <ProjectStatusBadge :status="project.status" />
          </TableCell>
          <TableCell class="hidden md:table-cell">{{ project.startDate ? formatDate(project.startDate) : '—' }}</TableCell>
          <TableCell>
            <div class="flex items-center gap-1">
              <ProjectStatusActions
                :project="project"
                @status-change="(id, status) => emit('statusChange', id, status)"
              />
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="router.push(`/projects/${project.id}`)">
                    <Eye class="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="emit('edit', project)">
                    <Pencil class="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    class="text-destructive focus:text-destructive"
                    @click="emit('delete', project)"
                  >
                    <Trash2 class="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

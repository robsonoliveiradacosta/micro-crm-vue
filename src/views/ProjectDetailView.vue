<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { toast } from 'vue-sonner'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import ProjectStatusBadge from '@/components/projects/ProjectStatusBadge.vue'
import ProjectStatusActions from '@/components/projects/ProjectStatusActions.vue'
import ProjectFormDialog from '@/components/projects/ProjectFormDialog.vue'
import ProjectDeleteDialog from '@/components/projects/ProjectDeleteDialog.vue'
import NoteForm from '@/components/notes/NoteForm.vue'
import NoteList from '@/components/notes/NoteList.vue'
import { useProjectsStore } from '@/stores/projects'
import { useClientsStore } from '@/stores/clients'
import { useNotesStore } from '@/stores/notes'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { ProjectStatus } from '@/types'

const route = useRoute()
const router = useRouter()

const projectsStore = useProjectsStore()
const clientsStore = useClientsStore()
const notesStore = useNotesStore()

const projectId = route.params.id as string

const formOpen = ref(false)
const deleteOpen = ref(false)

const project = computed(() => projectsStore.projects.find((p) => p.id === projectId))

const clientName = computed(() => {
  if (!project.value) return '—'
  const client = clientsStore.clients.find((c) => c.id === project.value!.clientId)
  return client?.name ?? '—'
})

onMounted(async () => {
  const tasks: Promise<unknown>[] = [notesStore.fetchNotes(projectId)]

  if (projectsStore.projects.length === 0) {
    tasks.push(projectsStore.fetchProjects())
  }
  if (clientsStore.clients.length === 0) {
    tasks.push(clientsStore.fetchClients())
  }

  await Promise.all(tasks)
})

async function handleStatusChange(id: string, newStatus: ProjectStatus) {
  try {
    await projectsStore.updateStatus(id, newStatus)
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.data?.message || 'Erro ao alterar status'
      : 'Erro ao alterar status'
    toast.error(message)
  }
}

// Redirect to projects list after the project is deleted from store
watch(
  [project, () => projectsStore.loading],
  ([proj, loading]) => {
    if (!loading && !proj && projectsStore.projects.length > 0) {
      router.push('/projects')
    }
  },
)
</script>

<template>
  <div class="space-y-6 p-4 sm:p-6">
    <!-- Back button -->
    <Button variant="ghost" size="sm" @click="router.push('/projects')">
      <ArrowLeft class="mr-2 h-4 w-4" />
      Voltar para Projetos
    </Button>

    <!-- Loading skeleton -->
    <div v-if="projectsStore.loading" class="space-y-4">
      <Skeleton class="h-8 w-64" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-3/4" />
    </div>

    <!-- Not found -->
    <div v-else-if="!project" class="text-muted-foreground py-12 text-center">
      Projeto não encontrado.
    </div>

    <template v-else>
      <!-- Project header -->
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-bold">{{ project.title }}</h1>
          <div class="flex items-center gap-2">
            <ProjectStatusBadge :status="project.status" />
            <ProjectStatusActions :project="project" @status-change="handleStatusChange" />
          </div>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="formOpen = true">
            <Pencil class="mr-1 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="text-destructive hover:text-destructive"
            @click="deleteOpen = true"
          >
            <Trash2 class="mr-1 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <!-- Project details grid -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">Cliente</p>
          <p class="mt-1 text-sm font-medium">{{ clientName }}</p>
        </div>
        <div>
          <p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">Valor</p>
          <p class="mt-1 text-sm font-medium">{{ formatCurrency(project.value) }}</p>
        </div>
        <div>
          <p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Data Início
          </p>
          <p class="mt-1 text-sm font-medium">
            {{ project.startDate ? formatDate(project.startDate) : '—' }}
          </p>
        </div>
        <div>
          <p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">Data Fim</p>
          <p class="mt-1 text-sm font-medium">
            {{ project.endDate ? formatDate(project.endDate) : '—' }}
          </p>
        </div>
      </div>

      <div v-if="project.description">
        <p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">Descrição</p>
        <p class="mt-1 whitespace-pre-wrap text-sm">{{ project.description }}</p>
      </div>

      <Separator />

      <!-- Notes section -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold">Notas</h2>
        <NoteForm :project-id="projectId" />
        <div v-if="notesStore.loading" class="space-y-2">
          <Skeleton class="h-16 w-full" />
          <Skeleton class="h-16 w-full" />
        </div>
        <NoteList v-else :notes="notesStore.notes" />
      </div>
    </template>

    <ProjectFormDialog v-model:open="formOpen" :project="project" />

    <ProjectDeleteDialog v-model:open="deleteOpen" :project="project" />
  </div>
</template>

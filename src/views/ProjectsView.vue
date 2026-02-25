<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import axios from 'axios'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ProjectTable from '@/components/projects/ProjectTable.vue'
import ProjectFormDialog from '@/components/projects/ProjectFormDialog.vue'
import ProjectDeleteDialog from '@/components/projects/ProjectDeleteDialog.vue'
import { useProjectsStore } from '@/stores/projects'
import { useClientsStore } from '@/stores/clients'
import { STATUS_LABELS } from '@/lib/utils'
import type { Project, ProjectStatus } from '@/types'

const projectsStore = useProjectsStore()
const clientsStore = useClientsStore()

const formOpen = ref(false)
const deleteOpen = ref(false)
const selectedProject = ref<Project | undefined>()

const filterClientId = ref<string>('')
const filterStatus = ref<string>('')

onMounted(() => {
  if (clientsStore.clients.length === 0) {
    clientsStore.fetchClients()
  }
  projectsStore.fetchProjects()
})

watch([filterClientId, filterStatus], () => {
  projectsStore.fetchProjects({
    clientId: filterClientId.value || undefined,
    status: (filterStatus.value as ProjectStatus) || undefined,
  })
})

function openCreate() {
  selectedProject.value = undefined
  formOpen.value = true
}

function openEdit(project: Project) {
  selectedProject.value = project
  formOpen.value = true
}

function openDelete(project: Project) {
  selectedProject.value = project
  deleteOpen.value = true
}

async function handleStatusChange(projectId: string, newStatus: ProjectStatus) {
  try {
    await projectsStore.updateStatus(projectId, newStatus)
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.data?.message || 'Erro ao alterar status'
      : 'Erro ao alterar status'
    toast.error(message)
  }
}

const allStatuses: ProjectStatus[] = ['ORCAMENTO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Projetos</h1>
      <Button @click="openCreate">
        <Plus class="mr-2 h-4 w-4" />
        Novo Projeto
      </Button>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-3">
      <Select v-model="filterClientId">
        <SelectTrigger class="w-52">
          <SelectValue placeholder="Todos os clientes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os clientes</SelectItem>
          <SelectItem
            v-for="client in clientsStore.clients"
            :key="client.id"
            :value="client.id"
          >
            {{ client.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="filterStatus">
        <SelectTrigger class="w-44">
          <SelectValue placeholder="Todos os status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os status</SelectItem>
          <SelectItem v-for="status in allStatuses" :key="status" :value="status">
            {{ STATUS_LABELS[status] }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Loading skeleton -->
    <div v-if="projectsStore.loading" class="space-y-2">
      <Skeleton class="h-10 w-full" />
      <Skeleton class="h-10 w-full" />
      <Skeleton class="h-10 w-full" />
    </div>

    <ProjectTable
      v-else
      :projects="projectsStore.projects"
      :clients="clientsStore.clients"
      @edit="openEdit"
      @delete="openDelete"
      @status-change="handleStatusChange"
      @create="openCreate"
    />

    <ProjectFormDialog v-model:open="formOpen" :project="selectedProject" />

    <ProjectDeleteDialog v-model:open="deleteOpen" :project="selectedProject" />
  </div>
</template>

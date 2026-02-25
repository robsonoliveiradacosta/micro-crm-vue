import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { toast } from 'vue-sonner'
import api from '@/api'
import type { Project, ProjectRequest, ProjectStatus } from '@/types'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filterClientId = ref<string | null>(null)
  const filterStatus = ref<ProjectStatus | null>(null)

  async function fetchProjects(filters?: { clientId?: string; status?: ProjectStatus }) {
    loading.value = true
    error.value = null
    try {
      const params: Record<string, string> = {}
      const clientId = filters?.clientId ?? filterClientId.value
      const status = filters?.status ?? filterStatus.value
      if (clientId) params.clientId = clientId
      if (status) params.status = status

      const response = await api.get<Project[]>('/v1/projects', { params })
      projects.value = response.data
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Erro ao carregar projetos'
        : 'Erro ao carregar projetos'
      error.value = message
      toast.error(message)
    } finally {
      loading.value = false
    }
  }

  async function createProject(data: ProjectRequest) {
    const response = await api.post<Project>('/v1/projects', data)
    projects.value.push(response.data)
    toast.success('Projeto criado com sucesso')
    return response.data
  }

  async function updateProject(id: string, data: ProjectRequest) {
    const response = await api.put<Project>(`/v1/projects/${id}`, data)
    const index = projects.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      projects.value[index] = response.data
    }
    toast.success('Projeto atualizado com sucesso')
    return response.data
  }

  async function updateStatus(id: string, status: ProjectStatus) {
    const response = await api.patch<Project>(`/v1/projects/${id}/status`, { status })
    const index = projects.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      projects.value[index] = response.data
    }
    toast.success('Status atualizado com sucesso')
    return response.data
  }

  async function deleteProject(id: string) {
    await api.delete(`/v1/projects/${id}`)
    projects.value = projects.value.filter((p) => p.id !== id)
    toast.success('Projeto excluído com sucesso')
  }

  return {
    projects,
    loading,
    error,
    filterClientId,
    filterStatus,
    fetchProjects,
    createProject,
    updateProject,
    updateStatus,
    deleteProject,
  }
})

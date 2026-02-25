import { ref } from 'vue'
import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'
import api from '@/api'
import type { Dashboard } from '@/types'

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref<Dashboard | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<Dashboard>('/v1/dashboard')
      data.value = response.data
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar dashboard'
      error.value = message
      toast.error(message)
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    fetchDashboard,
  }
})

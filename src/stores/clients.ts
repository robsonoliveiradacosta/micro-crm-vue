import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { toast } from 'vue-sonner'
import api from '@/api'
import type { Client, ClientRequest } from '@/types'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref<Client[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchClients() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<Client[]>('/v1/clients')
      clients.value = response.data
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Erro ao carregar clientes'
        : 'Erro ao carregar clientes'
      error.value = message
      toast.error(message)
    } finally {
      loading.value = false
    }
  }

  async function createClient(data: ClientRequest) {
    const response = await api.post<Client>('/v1/clients', data)
    clients.value.push(response.data)
    toast.success('Cliente criado com sucesso')
    return response.data
  }

  async function updateClient(id: string, data: ClientRequest) {
    const response = await api.put<Client>(`/v1/clients/${id}`, data)
    const index = clients.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      clients.value[index] = response.data
    }
    toast.success('Cliente atualizado com sucesso')
    return response.data
  }

  async function deleteClient(id: string) {
    await api.delete(`/v1/clients/${id}`)
    clients.value = clients.value.filter((c) => c.id !== id)
    toast.success('Cliente excluído com sucesso')
  }

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  }
})

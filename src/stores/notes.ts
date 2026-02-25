import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { toast } from 'vue-sonner'
import api from '@/api'
import type { Note, NoteRequest } from '@/types'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchNotes(projectId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<Note[]>(`/v1/projects/${projectId}/notes`)
      notes.value = response.data
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Erro ao carregar notas'
        : 'Erro ao carregar notas'
      error.value = message
      toast.error(message)
    } finally {
      loading.value = false
    }
  }

  async function createNote(projectId: string, data: NoteRequest) {
    const response = await api.post<Note>(`/v1/projects/${projectId}/notes`, data)
    notes.value.push(response.data)
    toast.success('Nota adicionada com sucesso')
    return response.data
  }

  async function deleteNote(id: string) {
    await api.delete(`/v1/notes/${id}`)
    notes.value = notes.value.filter((n) => n.id !== id)
    toast.success('Nota excluída com sucesso')
  }

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    deleteNote,
  }
})

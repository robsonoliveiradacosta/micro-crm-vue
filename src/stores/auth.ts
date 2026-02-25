import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'
import router from '@/router'
import type { LoginRequest, RegisterRequest, TokenResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function initialize() {
    const stored = localStorage.getItem('token')
    if (stored) {
      token.value = stored
    }
  }

  async function login(credentials: LoginRequest) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post<TokenResponse>('/v1/auth/login', credentials)
      token.value = data.token
      localStorage.setItem('token', data.token)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao fazer login'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterRequest) {
    loading.value = true
    error.value = null
    try {
      await api.post('/v1/auth/register', data)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar conta'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  async function deleteAccount() {
    loading.value = true
    error.value = null
    try {
      await api.delete('/v1/auth/account')
      logout()
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao excluir conta'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    loading,
    error,
    isAuthenticated,
    initialize,
    login,
    register,
    logout,
    deleteAccount,
  }
})

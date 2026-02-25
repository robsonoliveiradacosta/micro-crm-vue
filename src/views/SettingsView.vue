<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const showDeleteDialog = ref(false)
const deleting = ref(false)

async function confirmDeleteAccount() {
  deleting.value = true
  try {
    await authStore.deleteAccount()
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.data?.message || 'Erro ao excluir conta'
      : 'Erro ao excluir conta'
    toast.error(message)
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="mb-6 text-2xl font-bold">Configurações</h1>

    <section>
      <h2 class="mb-4 text-lg font-semibold">Conta</h2>

      <div class="rounded-lg border border-destructive/50 p-6">
        <h3 class="mb-2 font-semibold text-destructive">Zona de Perigo</h3>
        <p class="text-muted-foreground mb-4 text-sm">
          Ao excluir sua conta, todos os dados (clientes, projetos e notas) serão permanentemente
          removidos.
        </p>
        <Button variant="destructive" @click="showDeleteDialog = true">Excluir minha conta</Button>
      </div>
    </section>

    <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir conta permanentemente?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação é irreversível. Todos os seus dados serão removidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel :disabled="deleting">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            :disabled="deleting"
            @click="confirmDeleteAccount"
          >
            {{ deleting ? 'Excluindo…' : 'Sim, excluir minha conta' }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

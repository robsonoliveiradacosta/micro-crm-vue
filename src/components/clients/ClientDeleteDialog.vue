<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue-sonner'
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
import { useClientsStore } from '@/stores/clients'
import type { Client } from '@/types'

const props = defineProps<{
  open: boolean
  client?: Client
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const clientsStore = useClientsStore()
const deleting = ref(false)

async function confirmDelete() {
  if (!props.client) return

  deleting.value = true
  try {
    await clientsStore.deleteClient(props.client.id)
    emit('update:open', false)
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.data?.message || 'Erro ao excluir cliente'
      : 'Erro ao excluir cliente'
    toast.error(message)
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <AlertDialog :open="open" @update:open="emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir
          <strong>{{ client?.name }}</strong>? Ao excluir este cliente, todos os seus projetos e
          notas também serão removidos. Esta ação não pode ser desfeita.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="deleting">Cancelar</AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          :disabled="deleting"
          @click="confirmDelete"
        >
          {{ deleting ? 'Excluindo…' : 'Excluir' }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

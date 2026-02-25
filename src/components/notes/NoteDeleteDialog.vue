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
import { useNotesStore } from '@/stores/notes'
import type { Note } from '@/types'

const props = defineProps<{
  open: boolean
  note?: Note
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const notesStore = useNotesStore()
const deleting = ref(false)

async function confirmDelete() {
  if (!props.note) return

  deleting.value = true
  try {
    await notesStore.deleteNote(props.note.id)
    emit('update:open', false)
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.data?.message || 'Erro ao excluir nota'
      : 'Erro ao excluir nota'
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
        <AlertDialogTitle>Excluir nota</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.
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

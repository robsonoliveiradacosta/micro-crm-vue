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
import { useProjectsStore } from '@/stores/projects'
import type { Project } from '@/types'

const props = defineProps<{
  open: boolean
  project?: Project
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const projectsStore = useProjectsStore()
const deleting = ref(false)

async function confirmDelete() {
  if (!props.project) return

  deleting.value = true
  try {
    await projectsStore.deleteProject(props.project.id)
    emit('update:open', false)
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.data?.message || 'Erro ao excluir projeto'
      : 'Erro ao excluir projeto'
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
        <AlertDialogTitle>Excluir projeto</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir
          <strong>{{ project?.title }}</strong>? Ao excluir este projeto, todas as notas também
          serão removidas. Esta ação não pode ser desfeita.
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

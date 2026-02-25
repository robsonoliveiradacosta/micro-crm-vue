<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useNotesStore } from '@/stores/notes'

const props = defineProps<{
  projectId: string
}>()

const notesStore = useNotesStore()
const content = ref('')
const submitting = ref(false)
const contentError = ref('')

async function submit() {
  contentError.value = ''
  if (!content.value.trim()) {
    contentError.value = 'O conteúdo da nota não pode ser vazio'
    return
  }

  submitting.value = true
  try {
    await notesStore.createNote(props.projectId, { content: content.value.trim() })
    content.value = ''
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.data?.message || 'Erro ao adicionar nota'
      : 'Erro ao adicionar nota'
    toast.error(message)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="space-y-2" @submit.prevent="submit">
    <Textarea
      v-model="content"
      placeholder="Escreva uma nota…"
      rows="3"
      :disabled="submitting"
    />
    <p v-if="contentError" class="text-destructive text-xs">{{ contentError }}</p>
    <div class="flex justify-end">
      <Button type="submit" :disabled="submitting">
        {{ submitting ? 'Enviando…' : 'Enviar' }}
      </Button>
    </div>
  </form>
</template>

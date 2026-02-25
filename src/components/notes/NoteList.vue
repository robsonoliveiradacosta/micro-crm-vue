<script setup lang="ts">
import { ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import NoteDeleteDialog from '@/components/notes/NoteDeleteDialog.vue'
import { formatDate } from '@/lib/utils'
import type { Note } from '@/types'

defineProps<{
  notes: Note[]
}>()

const deleteOpen = ref(false)
const selectedNote = ref<Note | undefined>()

function openDelete(note: Note) {
  selectedNote.value = note
  deleteOpen.value = true
}
</script>

<template>
  <div>
    <div v-if="notes.length === 0" class="text-muted-foreground py-6 text-center text-sm">
      Nenhuma nota registrada.
    </div>

    <ul v-else class="space-y-3">
      <li
        v-for="note in notes"
        :key="note.id"
        class="bg-muted/40 flex items-start justify-between gap-3 rounded-md border p-3"
      >
        <div class="min-w-0 flex-1">
          <p class="whitespace-pre-wrap text-sm">{{ note.content }}</p>
          <p class="text-muted-foreground mt-1 text-xs">{{ formatDate(note.createdAt) }}</p>
        </div>
        <Button variant="ghost" size="icon" class="shrink-0" @click="openDelete(note)">
          <Trash2 class="h-4 w-4 text-destructive" />
        </Button>
      </li>
    </ul>

    <NoteDeleteDialog v-model:open="deleteOpen" :note="selectedNote" />
  </div>
</template>

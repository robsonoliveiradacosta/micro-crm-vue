<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import { toast } from 'vue-sonner'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjectsStore } from '@/stores/projects'
import { useClientsStore } from '@/stores/clients'
import type { Project, ProjectRequest, ApiValidationError } from '@/types'

const props = defineProps<{
  open: boolean
  project?: Project
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const projectsStore = useProjectsStore()
const clientsStore = useClientsStore()

const form = ref<ProjectRequest & { valueStr: string }>({
  clientId: '',
  title: '',
  description: '',
  value: 0,
  valueStr: '',
  startDate: '',
  endDate: '',
})
const fieldErrors = ref<Record<string, string>>({})
const submitting = ref(false)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.value = {
        clientId: props.project?.clientId ?? '',
        title: props.project?.title ?? '',
        description: props.project?.description ?? '',
        value: props.project?.value ?? 0,
        valueStr: props.project?.value?.toString() ?? '',
        startDate: props.project?.startDate ?? '',
        endDate: props.project?.endDate ?? '',
      }
      fieldErrors.value = {}
    }
  },
)

function close() {
  emit('update:open', false)
}

async function submit() {
  fieldErrors.value = {}

  if (!form.value.clientId) {
    fieldErrors.value.clientId = 'Cliente é obrigatório'
    return
  }
  if (!form.value.title.trim()) {
    fieldErrors.value.title = 'Título é obrigatório'
    return
  }
  const parsedValue = parseFloat(form.value.valueStr)
  if (isNaN(parsedValue) || parsedValue < 0) {
    fieldErrors.value.value = 'Valor deve ser um número maior ou igual a 0'
    return
  }

  submitting.value = true
  try {
    const payload: ProjectRequest = {
      clientId: form.value.clientId,
      title: form.value.title.trim(),
      description: form.value.description?.trim() || undefined,
      value: parsedValue,
      startDate: form.value.startDate || undefined,
      endDate: form.value.endDate || undefined,
    }

    if (props.project) {
      await projectsStore.updateProject(props.project.id, payload)
    } else {
      await projectsStore.createProject(payload)
    }
    close()
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiValidationError | undefined
      if (data?.fieldErrors) {
        for (const fe of data.fieldErrors) {
          fieldErrors.value[fe.field] = fe.message
        }
      } else {
        toast.error(data?.message || 'Erro ao salvar projeto')
      }
    } else {
      toast.error('Erro ao salvar projeto')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ project ? 'Editar Projeto' : 'Novo Projeto' }}</DialogTitle>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="submit">
        <!-- Cliente -->
        <div class="space-y-1">
          <Label>Cliente <span class="text-destructive">*</span></Label>
          <Select v-model="form.clientId">
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="client in clientsStore.clients"
                :key="client.id"
                :value="client.id"
              >
                {{ client.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <p v-if="fieldErrors.clientId" class="text-destructive text-xs">
            {{ fieldErrors.clientId }}
          </p>
        </div>

        <!-- Título -->
        <div class="space-y-1">
          <Label for="title">Título <span class="text-destructive">*</span></Label>
          <Input id="title" v-model="form.title" placeholder="Título do projeto" />
          <p v-if="fieldErrors.title" class="text-destructive text-xs">{{ fieldErrors.title }}</p>
        </div>

        <!-- Descrição -->
        <div class="space-y-1">
          <Label for="description">Descrição</Label>
          <Textarea id="description" v-model="form.description" placeholder="Descrição do projeto" rows="3" />
          <p v-if="fieldErrors.description" class="text-destructive text-xs">
            {{ fieldErrors.description }}
          </p>
        </div>

        <!-- Valor -->
        <div class="space-y-1">
          <Label for="value">Valor (R$) <span class="text-destructive">*</span></Label>
          <Input
            id="value"
            v-model="form.valueStr"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
          />
          <p v-if="fieldErrors.value" class="text-destructive text-xs">{{ fieldErrors.value }}</p>
        </div>

        <!-- Datas -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="space-y-1">
            <Label for="startDate">Data Início</Label>
            <Input id="startDate" v-model="form.startDate" type="date" />
          </div>
          <div class="space-y-1">
            <Label for="endDate">Data Fim</Label>
            <Input id="endDate" v-model="form.endDate" type="date" />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="close">Cancelar</Button>
          <Button type="submit" :disabled="submitting">
            {{ submitting ? 'Salvando…' : 'Salvar' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

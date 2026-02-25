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
import { useClientsStore } from '@/stores/clients'
import type { Client, ClientRequest, ApiValidationError } from '@/types'

const props = defineProps<{
  open: boolean
  client?: Client
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const clientsStore = useClientsStore()

const form = ref<ClientRequest>({ name: '', email: '', phone: '', company: '' })
const fieldErrors = ref<Record<string, string>>({})
const submitting = ref(false)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.value = {
        name: props.client?.name ?? '',
        email: props.client?.email ?? '',
        phone: props.client?.phone ?? '',
        company: props.client?.company ?? '',
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

  if (!form.value.name.trim()) {
    fieldErrors.value.name = 'Nome é obrigatório'
    return
  }

  submitting.value = true
  try {
    const payload: ClientRequest = {
      name: form.value.name.trim(),
      email: form.value.email?.trim() || undefined,
      phone: form.value.phone?.trim() || undefined,
      company: form.value.company?.trim() || undefined,
    }

    if (props.client) {
      await clientsStore.updateClient(props.client.id, payload)
    } else {
      await clientsStore.createClient(payload)
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
        toast.error(data?.message || 'Erro ao salvar cliente')
      }
    } else {
      toast.error('Erro ao salvar cliente')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ client ? 'Editar Cliente' : 'Novo Cliente' }}</DialogTitle>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="submit">
        <div class="space-y-1">
          <Label for="name">Nome <span class="text-destructive">*</span></Label>
          <Input id="name" v-model="form.name" placeholder="Nome do cliente" />
          <p v-if="fieldErrors.name" class="text-destructive text-xs">{{ fieldErrors.name }}</p>
        </div>

        <div class="space-y-1">
          <Label for="email">Email</Label>
          <Input id="email" v-model="form.email" type="email" placeholder="email@exemplo.com" />
          <p v-if="fieldErrors.email" class="text-destructive text-xs">{{ fieldErrors.email }}</p>
        </div>

        <div class="space-y-1">
          <Label for="phone">Telefone</Label>
          <Input id="phone" v-model="form.phone" placeholder="(11) 99999-9999" />
          <p v-if="fieldErrors.phone" class="text-destructive text-xs">{{ fieldErrors.phone }}</p>
        </div>

        <div class="space-y-1">
          <Label for="company">Empresa</Label>
          <Input id="company" v-model="form.company" placeholder="Nome da empresa" />
          <p v-if="fieldErrors.company" class="text-destructive text-xs">
            {{ fieldErrors.company }}
          </p>
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

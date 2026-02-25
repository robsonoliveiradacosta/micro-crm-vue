<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ClientTable from '@/components/clients/ClientTable.vue'
import ClientFormDialog from '@/components/clients/ClientFormDialog.vue'
import ClientDeleteDialog from '@/components/clients/ClientDeleteDialog.vue'
import { useClientsStore } from '@/stores/clients'
import type { Client } from '@/types'

const clientsStore = useClientsStore()

const formOpen = ref(false)
const deleteOpen = ref(false)
const selectedClient = ref<Client | undefined>()

onMounted(() => {
  clientsStore.fetchClients()
})

function openCreate() {
  selectedClient.value = undefined
  formOpen.value = true
}

function openEdit(client: Client) {
  selectedClient.value = client
  formOpen.value = true
}

function openDelete(client: Client) {
  selectedClient.value = client
  deleteOpen.value = true
}
</script>

<template>
  <div class="space-y-6 p-4 sm:p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Clientes</h1>
      <Button @click="openCreate">
        <Plus class="mr-2 h-4 w-4" />
        Novo Cliente
      </Button>
    </div>

    <div v-if="clientsStore.loading" class="space-y-2">
      <Skeleton class="h-10 w-full" />
      <Skeleton class="h-10 w-full" />
      <Skeleton class="h-10 w-full" />
    </div>

    <ClientTable
      v-else
      :clients="clientsStore.clients"
      @edit="openEdit"
      @delete="openDelete"
      @create="openCreate"
    />

    <ClientFormDialog
      v-model:open="formOpen"
      :client="selectedClient"
    />

    <ClientDeleteDialog
      v-model:open="deleteOpen"
      :client="selectedClient"
    />
  </div>
</template>

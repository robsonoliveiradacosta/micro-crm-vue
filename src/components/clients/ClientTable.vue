<script setup lang="ts">
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-vue-next'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { Client } from '@/types'

defineProps<{ clients: Client[] }>()

const emit = defineEmits<{
  edit: [client: Client]
  delete: [client: Client]
  create: []
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead class="hidden sm:table-cell">Email</TableHead>
          <TableHead class="hidden sm:table-cell">Telefone</TableHead>
          <TableHead class="hidden sm:table-cell">Empresa</TableHead>
          <TableHead class="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty v-if="clients.length === 0" :colspan="5">
          <div class="py-8 text-center">
            <p class="text-muted-foreground mb-4 text-sm">Nenhum cliente cadastrado</p>
            <Button size="sm" @click="emit('create')">Cadastrar cliente</Button>
          </div>
        </TableEmpty>
        <TableRow v-for="client in clients" :key="client.id">
          <TableCell class="font-medium">{{ client.name }}</TableCell>
          <TableCell class="hidden sm:table-cell">{{ client.email ?? '—' }}</TableCell>
          <TableCell class="hidden sm:table-cell">{{ client.phone ?? '—' }}</TableCell>
          <TableCell class="hidden sm:table-cell">{{ client.company ?? '—' }}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="emit('edit', client)">
                  <Pencil class="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  class="text-destructive focus:text-destructive"
                  @click="emit('delete', client)"
                >
                  <Trash2 class="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

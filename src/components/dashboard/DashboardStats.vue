<script setup lang="ts">
import { Users, FileText, Clock, CheckCircle, XCircle } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import type { Dashboard } from '@/types'

defineProps<{ data: Dashboard }>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total de Clientes</CardTitle>
        <Users class="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ data.totalClients }}</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Orçamento</CardTitle>
        <FileText class="h-4 w-4 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-yellow-600">
          {{ formatCurrency(data.totalByStatus.ORCAMENTO) }}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Em Andamento</CardTitle>
        <Clock class="h-4 w-4 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-blue-600">
          {{ formatCurrency(data.totalByStatus.EM_ANDAMENTO) }}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Concluído</CardTitle>
        <CheckCircle class="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-green-600">
          {{ formatCurrency(data.totalByStatus.CONCLUIDO) }}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Cancelado</CardTitle>
        <XCircle class="h-4 w-4 text-red-500" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-red-600">
          {{ formatCurrency(data.totalByStatus.CANCELADO) }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>

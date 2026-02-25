<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleSubmit() {
  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push('/')
  } catch {
    // error is set in the store
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <Card class="w-full max-w-sm">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl">Micro CRM</CardTitle>
        <CardDescription>Entre com suas credenciais</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Senha</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••"
              required
            />
          </div>

          <p v-if="authStore.error" class="text-sm text-destructive">
            {{ authStore.error }}
          </p>

          <Button type="submit" class="w-full" :disabled="authStore.loading">
            <Loader2Icon v-if="authStore.loading" class="mr-2 h-4 w-4 animate-spin" />
            Entrar
          </Button>
        </form>

        <p class="mt-4 text-center text-sm text-muted-foreground">
          Não tem conta?
          <RouterLink to="/register" class="text-primary underline-offset-4 hover:underline">
            Cadastre-se
          </RouterLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>

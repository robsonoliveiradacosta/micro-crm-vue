<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordError = ref<string | null>(null)

function validatePassword() {
  if (password.value.length > 0 && password.value.length < 6) {
    passwordError.value = 'A senha deve ter no mínimo 6 caracteres'
  } else {
    passwordError.value = null
  }
}

async function handleSubmit() {
  if (password.value.length < 6) {
    passwordError.value = 'A senha deve ter no mínimo 6 caracteres'
    return
  }

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    })
    toast.success('Conta criada com sucesso!')
    router.push('/login')
  } catch {
    // error is set in the store
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <Card class="w-full max-w-sm">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl">Criar Conta</CardTitle>
        <CardDescription>Preencha os dados para se cadastrar</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="name">Nome</Label>
            <Input
              id="name"
              v-model="name"
              type="text"
              placeholder="Seu nome"
              required
            />
          </div>
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
              placeholder="Mínimo 6 caracteres"
              required
              minlength="6"
              @blur="validatePassword"
              @input="validatePassword"
            />
            <p v-if="passwordError" class="text-sm text-destructive">
              {{ passwordError }}
            </p>
          </div>

          <p v-if="authStore.error" class="text-sm text-destructive">
            {{ authStore.error }}
          </p>

          <Button type="submit" class="w-full" :disabled="authStore.loading">
            <Loader2Icon v-if="authStore.loading" class="mr-2 h-4 w-4 animate-spin" />
            Cadastrar
          </Button>
        </form>

        <p class="mt-4 text-center text-sm text-muted-foreground">
          Já tem conta?
          <RouterLink to="/login" class="text-primary underline-offset-4 hover:underline">
            Entrar
          </RouterLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>

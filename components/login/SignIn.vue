<template>
  <form
    class="w-full h-full flex flex-col justify-around gap-2 p-4"
    @submit.prevent="onSignIn"
  >
    <div class="flex flex-row justify-center items-center gap-1 my-1">
      <User class="size-5" />
      <h1 class="text-lg text-center">Connexion</h1>
    </div>

    <InputText name="email" placeholder="Email" />

    <InputText name="password" type="password" placeholder="Mot de passe" />

    <Button size="lg" type="submit" class="mt-2 hover:cursor-pointer">
      Se connecter
    </Button>
  </form>
</template>

<script setup>
import { User } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import InputText from '@/components/inputs/InputText'

const { signIn } = useAuth()

const validationSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(5)
  })
)
const { values, errors, handleSubmit } = useForm({
  validationSchema
})

const onSignIn = handleSubmit(values => {
  console.log('Signing in with', values)
  signIn('credentials', values)
})
</script>

<template>
  <form
    class="flex h-full w-full flex-col justify-around gap-2 pt-4"
    @submit.prevent="onSignIn"
  >
    <div class="my-1 flex flex-row items-center justify-center gap-1">
      <User class="text-primary-700 size-5" />
      <h1 class="text-primary-700 text-center text-lg">Connexion</h1>
    </div>

    <CustomInput name="email" placeholder="Email" />

    <CustomInput name="password" type="password" placeholder="Mot de passe" />

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

import CustomInput from '@/components/inputs/CustomInput'

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

const onSignIn = handleSubmit((values) => {
  console.log('Signing in with', values)
  signIn('credentials', values)
})
</script>

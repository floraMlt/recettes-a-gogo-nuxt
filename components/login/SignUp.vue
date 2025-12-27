<template>
  <form class="flex h-full w-full flex-col gap-2 pt-4" @submit="onSignUp">
    <div class="my-1 flex flex-row items-center justify-center gap-3">
      <User class="size-5" />

      <h1 class="text-center text-lg">Inscription</h1>
    </div>

    <div class="flex justify-between gap-2">
      <CustomInput
        name="firstName"
        placeholder="Prénom"
        input-class="w-[48%]"
      />

      <CustomInput name="lastName" placeholder="Nom" input-class="w-[48%]" />
    </div>

    <CustomInput name="email" placeholder="Email" />

    <CustomInput name="password" type="password" placeholder="Mot de passe" />

    <Button size="lg" type="submit" class="mt-2 hover:cursor-pointer">
      Créer un compte
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
    password: z.string().min(6),
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    isAdmin: z.boolean().optional().default(false)
  })
)

const { values, errors, handleSubmit } = useForm({
  validationSchema
})

const onSignUp = handleSubmit(async (values) => {
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: values
    })
  } catch (error) {
    console.error('Error creating user:', error)
  }
})
</script>

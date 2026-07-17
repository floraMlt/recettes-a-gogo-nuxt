<template>
  <form class="flex h-full w-full flex-col gap-2 pt-4" @submit="onSignUp">
    <div class="my-1 flex flex-row items-center justify-center gap-3">
      <UserIcon class="size-5" />

      <h1 class="text-center text-lg">Inscription</h1>
    </div>

    <div class="flex flex-col justify-between gap-2 md:flex-row">
      <CustomInput
        name="firstName"
        placeholder="Prénom"
        input-class="md:w-[48%]"
      />

      <CustomInput name="lastName" placeholder="Nom" input-class="md:w-[48%]" />
    </div>

    <CustomInput name="email" placeholder="Email" />

    <CustomInput name="password" type="password" placeholder="Mot de passe" />

    <Button
      size="lg"
      type="submit"
      class="mt-2 hover:cursor-pointer"
      :disabled="isSubmitting"
    >
      Créer un compte
    </Button>
  </form>
</template>

<script setup>
import { UserIcon } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import * as z from 'zod'

import CustomInput from '@/components/inputs/CustomInput'

const { signIn } = useAuth()

const validationSchema = toTypedSchema(
  z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, '6 caractères minimum'),
    firstName: z.string().min(2, '2 caractères minimum'),
    lastName: z.string().min(2, '2 caractères minimum'),
    isAdmin: z.boolean().optional().default(false)
  })
)

const { values, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema
})

const onSignUp = handleSubmit(async (values) => {
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: values
    })
  } catch (error) {
    const message = error?.data?.message || error?.message || 'Erreur inconnue'
    toast.error('Erreur', {
      description: `Impossible de créer le compte : ${message}`
    })
    return
  }

  const result = await signIn('credentials', {
    email: values.email,
    password: values.password,
    redirect: false
  })

  if (result?.error) {
    toast.error('Erreur', {
      description:
        'Compte créé mais connexion impossible. Essayez de vous connecter.'
    })

    return
  }

  toast.success('Compte créé', {
    description: 'Votre compte a bien été créé.'
  })

  await navigateTo('/')
})
</script>

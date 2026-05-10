<template>
  <form
    class="flex h-full w-full flex-col justify-around gap-2 pt-4"
    @submit.prevent="onSignIn"
  >
    <div class="my-1 flex flex-row items-center justify-center gap-1">
      <UserIcon class="text-primary-700 size-5" />
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
import { UserIcon } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import * as z from 'zod'

import CustomInput from '@/components/inputs/CustomInput'

const { signIn } = useAuth()

const validationSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(5)
  })
)

const { handleSubmit } = useForm({
  validationSchema
})

const onSignIn = handleSubmit(async (values) => {
  try {
    const result = await signIn('credentials', {
      ...values,
      redirect: false,
      callbackUrl: '/'
    })

    if (result?.error) {
      toast.error('Erreur de connexion', {
        description: 'Email ou mot de passe incorrect'
      })
    }

    if (!result?.error && result?.url) {
      window.location.href = result.url
    }
  } catch (error) {
    if (error) {
      toast.error('Erreur de connexion', {
        description: error
      })
    }
  }
})
</script>

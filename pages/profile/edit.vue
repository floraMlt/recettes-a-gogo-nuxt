<template>
  <div
    class="relative h-full min-h-screen w-screen overflow-y-auto px-4 pt-[9vh] pb-20 md:px-[10vw] md:pt-[100px]"
  >
    <div
      class="h-[50%] w-[92vw] flex-col items-center justify-center rounded-2xl bg-white px-2 py-5 md:w-[80vw] md:px-15 md:py-10"
    >
      <div class="mb-6 flex items-center justify-center">
        <h1 class="text-primary-700 text-center text-2xl">Mon profil</h1>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr] md:gap-6">
        <div
          class="bg-secondary-100 mx-auto flex h-20 w-20 flex-col items-center justify-center gap-4 rounded-[150px] p-3 md:ml-4 md:h-[180px] md:w-[180px] md:p-10"
        >
          <NuxtImg src="/img/list2.png" format="webp" alt="User avatar" />
        </div>

        <form class="flex flex-col gap-4" @submit="editUser">
          <CustomInput name="lastName" label="Nom" placeholder="Nom" />

          <CustomInput name="firstName" label="Prénom" placeholder="Prénom" />

          <CustomInput name="email" label="Email" placeholder="Email" />

          <CustomCheckbox name="isAdmin" label="Administrateur" />

          <Button
            size="lg"
            type="submit"
            class="mt-2 ml-auto w-fit hover:cursor-pointer"
          >
            Éditer
          </Button>
        </form>
      </div>
    </div>

    <NuxtImg
      src="/img/recipe4.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 1500px) 60px, (max-width: 2500px) 6vw, 130px"
      class="absolute top-[10%] left-[6%] hidden w-[6%] max-w-[130px] min-w-[60px] rotate-15 md:block"
    />

    <NuxtImg
      src="/img/list3.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 500px) 60px, (max-width: 1000px) 12vw, 120px"
      class="absolute right-[8%] bottom-0 w-[12%] max-w-[120px] min-w-[60px]"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import CustomInput from '@/components/inputs/CustomInput'
import CustomCheckbox from '@/components/inputs/CustomCheckbox'

const router = useRouter()

const userId = ref(null)
const { data: userData } = await useAuth()
userId.value = userData.value?.user?.id

const { data: user } = await useFetch(
  `/api/users/${userId.value}?userId=${userId.value}`
)

const initialValues = ref({})

watchEffect(() => {
  if (user.value) {
    initialValues.value = {
      email: user.value.email ?? '',
      firstName: user.value.firstName ?? '',
      lastName: user.value.lastName ?? '',
      isAdmin: Boolean(user.value.isAdmin)
    }
  }
})

const validationSchema = toTypedSchema(
  z.object({
    email: z.string().email().optional(),
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    isAdmin: z.boolean().default(false)
  })
)

const { handleSubmit, setValues } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    firstName: '',
    lastName: '',
    isAdmin: false
  }
})

watchEffect(() => {
  if (user.value) {
    setValues({
      email: user.value.email ?? '',
      firstName: user.value.firstName ?? '',
      lastName: user.value.lastName ?? '',
      isAdmin: Boolean(user.value.isAdmin)
    })
  }
})

const editUser = handleSubmit(async (values) => {
  try {
    const modifiedFields = {}

    for (const key in values) {
      if (values[key] !== initialValues.value[key]) {
        modifiedFields[key] = values[key]
      }
    }

    if (Object.keys(modifiedFields).length === 0) {
      return
    }

    await $fetch(`/api/users/${userId.value}`, {
      method: 'PATCH',
      body: modifiedFields
    })

    toast('Profil mis à jour', {
      description: 'Votre profil a bien été mis à jour.',
      action: {
        label: 'Voir mon profil',
        onClick: () => {
          router.push('/profile')
        }
      }
    })
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour de l'utilisateur : ${error}`)
  }
})
</script>

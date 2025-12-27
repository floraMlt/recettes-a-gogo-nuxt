<template>
  <div class="relative h-full min-h-screen px-[10vw] pt-[100px] pb-20">
    <div
      class="h-[50%] w-[80vw] flex-col items-center justify-center rounded-2xl bg-[url('/img/background.jpg')] bg-cover bg-center px-15 py-10"
    >
      <div class="mb-6 flex items-center justify-center">
        <h1 class="text-primary-700 text-center text-2xl">Mon profil</h1>
        <NuxtLink to="/profile/edit">
          <Pen class="ml-2 size-5 hover:cursor-pointer hover:opacity-80" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-[1fr_2fr] gap-6">
        <div
          class="bg-secondary-100 ml-4 flex h-[180px] w-[180px] flex-col items-center justify-center gap-4 rounded-[150px] p-10"
        >
          <NuxtImg src="/img/list2.png" format="webp" alt="User avatar" />
        </div>

        <div>
          <h5 class="text-primary-700 font-bold">Nom</h5>
          <p class="text-primary-600">{{ user.lastName }}</p>

          <h5 class="text-primary-700 mt-3 font-bold">Prénom</h5>
          <p class="text-primary-600">{{ user.firstName }}</p>

          <h5 class="text-primary-700 mt-3 font-bold">Email</h5>
          <p class="text-primary-600">{{ user.email }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Pen } from 'lucide-vue-next'

const userId = ref(null)
const { data: userData } = await useAuth()
userId.value = userData.value?.user?.id

const { data: user } = await useFetch(
  `/api/users/${userId.value}?userId=${userId.value}`
)
</script>

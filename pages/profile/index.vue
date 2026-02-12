<template>
  <div
    class="relative h-full min-h-screen w-screen px-4 pt-[10vh] pb-20 md:px-[10vw] md:pt-[100px]"
  >
    <div
      class="h-[50%] w-full flex-col items-center justify-center rounded-2xl bg-[url('/img/background.jpg')] bg-cover bg-center px-1 py-4 md:w-[80vw] md:px-15 md:py-10"
    >
      <div class="mb-6 flex items-center justify-center">
        <h1 class="text-primary-700 text-center text-2xl">Mon profil</h1>
        <NuxtLink to="/profile/edit">
          <PenIcon
            class="ml-2 size-5 transition-transform duration-320 hover:scale-110 hover:rotate-3 hover:cursor-pointer"
          />
        </NuxtLink>
      </div>

      <div
        class="grid grid-cols-[1fr_3fr] gap-3 md:grid-cols-[1fr_2fr] md:gap-6"
      >
        <SignedImage
          :file-name="user.imageFileName || '/img/list2.png'"
          :initial-url="user.imageUrl || '/img/list2.png'"
          alt="Image de profil"
          class="bg-secondary-100 pointer-events-none aspect-square h-auto max-h-[250px] w-full rounded-full object-cover md:mx-auto md:h-[180px] md:w-[180px]"
        />

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

    <NuxtImg
      src="/img/auth1.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 500px) 60px, (max-width: 1000px) 12vw, 120px"
      class="absolute right-[4%] bottom-4 w-[12%] max-w-[120px] min-w-[60px] rotate-80"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PenIcon } from 'lucide-vue-next'

const userId = ref(null)
const { data: userData } = await useAuth()
userId.value = userData.value?.user?.id

const { data: user } = await useFetch(
  `/api/users/${userId.value}?userId=${userId.value}`
)
</script>

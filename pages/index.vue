<template>
  <div class="relative flex h-screen flex-col items-center justify-center">
    <div
      class="flex h-[50%] w-[80%] flex-col items-center justify-center rounded-2xl bg-[url('/img/background.jpg')] bg-cover bg-center py-10"
    >
      <h1 class="text-primary-700 pb-10 text-center text-3xl font-bold">
        Bienvenue sur Recette à gogo !
      </h1>

      <Button v-if="status == 'unauthenticated'" @click="router.push('/login')">
        Se connecter
      </Button>
    </div>

    <NuxtImg
      src="/img/home1.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 680px) 150px, (max-width: 1136px) 22vw, 250px"
      class="absolute top-[5%] right-0 w-[22%] max-w-[250px] min-w-[150px]"
    />

    <NuxtImg
      src="/img/home2.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 714px) 200px, (max-width: 1250px) 28vw, 350px"
      class="absolute bottom-0 left-0 w-[28%] max-w-[350px] min-w-[200px]"
    />

    <NuxtImg
      src="/img/home3.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 680px) 150px, (max-width: 1136px) 22vw, 250px"
      class="absolute right-0 bottom-0 w-[22%] max-w-[250px] min-w-[150px]"
    />

    <NuxtImg
      src="/img/home4.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 666px) 80px, (max-width: 1083px) 12vw, 130px"
      class="absolute top-[18%] left-[8%] w-[12%] max-w-[130px] min-w-20"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const { data, isFetching, error, refresh } = useFetch('/api/users')

const router = useRouter()

const { status } = useAuth()

definePageMeta({
  title: 'Home Page',
  meta: [
    { name: 'description', content: 'This is the home page of my Nuxt app.' }
  ]
})
</script>

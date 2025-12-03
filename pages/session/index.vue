<template>
  <div class="flex h-screen w-full flex-col items-center justify-center">
    <h1 class="text-primary-700 mb-10 text-4xl">Recettes à Gogo</h1>

    <div
      v-if="status == 'unauthenticated'"
      class="relative flex h-[55%] w-[75%] flex-col items-center justify-center rounded-2xl bg-white"
    >
      <LoginForm />

      <NuxtImg
        src="/img/auth1.png"
        alt="Image d'illustration"
        format="webp"
        sizes="(max-width: 533px) 80px, (max-width: 1000px) 15vw, 150px"
        class="absolute bottom-[2%] left-[2%] w-[15%] max-w-[150px] min-w-20"
      />

      <NuxtImg
        src="/img/auth2.png"
        alt="Image d'illustration"
        format="webp"
        sizes="(max-width: 444px) 80px, (max-width: 1111px) 18vw, 200px"
        class="absolute top-[5%] right-[5%] w-[18%] max-w-[200px] min-w-20"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Login Page',
  meta: [{ name: 'Login', content: 'This is the login page' }],
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' }
})

const { status } = useAuth()
</script>

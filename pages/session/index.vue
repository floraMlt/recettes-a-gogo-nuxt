<template>
  <div class="flex h-screen w-full flex-col items-center justify-center">
    <h1 class="text-primary-700 mb-10 text-4xl">Recettes à Gogo</h1>

    <div
      v-if="status == 'unauthenticated'"
      class="relative flex h-[55%] w-[75%] flex-col items-center justify-center
        rounded-2xl bg-white"
    >
      <LoginForm />

      <img
        src="/assets/img/auth1.png"
        class="absolute bottom-[2%] left-[2%] w-[15%] max-w-[150px] min-w-20"
      />

      <img
        src="/assets/img/auth2.png"
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

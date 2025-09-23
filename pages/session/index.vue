<template>
  <div class="h-screen w-full flex flex-col items-center">
    <div v-if="status == 'unauthenticated'">
      <LoginForm />
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

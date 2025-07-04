<template>
  <div>
    <p>{{ status }}</p>
    <template v-if="status == 'unauthenticated'">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="signIn('credentials', { email, password })">
        Sign In
      </button>
    </template>
    <button v-if="status == 'authenticated'" @click="signOut()">
      Sign Outç
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Home Page",
  meta: [
    { name: "description", content: "This is the home page of my Nuxt app." },
  ],
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' }
});

const email = ref("");
const password = ref("");
const { status, signIn, signOut, getSession } = useAuth();
</script>

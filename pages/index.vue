<template>
  <div>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
    <div>
      <div v-if="pending">Chargement...</div>
      <div v-else-if="error">Erreur : {{ error.message }}</div>
      <div v-else>
        <ul>
          <li v-for="user in data" :key="user.id">
            {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
          </li>
        </ul>
      </div>
    </div>
    <button @click="refresh">Rafraîchir</button>
        <button v-if="status == 'authenticated'" @click="signOut()">
      Sign Out
    </button>
  </div>


</template>

<script setup>
const { data, pending, error, refresh } = useFetch("/api/users");

const { signOut, status } = useAuth();

definePageMeta({
  title: "Home Page",
  meta: [
    { name: "description", content: "This is the home page of my Nuxt app." },
  ],
});
</script>

<template>
  <div>
    <NavigationMenu />

    <h1 class="text-3xl font-bold text-center">
      Bienvenue sur Recette à gogo !
    </h1>

    <div>
      <div v-if="pending">
        <Loader />
      </div>

      <div v-else-if="error">Erreur : {{ error.message }}</div>

      <div v-else>
        <ul>
          <li v-for="user in data" :key="user.id">
            {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
          </li>
        </ul>
      </div>
    </div>

    <Button @click="refresh">Rafraîchir</Button>
  </div>
</template>

<script setup>
const { data, pending, error, refresh } = useFetch('/api/users')

definePageMeta({
  title: 'Home Page',
  meta: [
    { name: 'description', content: 'This is the home page of my Nuxt app.' }
  ]
})
</script>

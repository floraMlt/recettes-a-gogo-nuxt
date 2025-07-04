<template>
  <div>
    <h1>Mes recettes</h1>

    <div>
      <div v-if="pending">Chargement...</div>
      <div v-else-if="error">Erreur : {{ error.message }}</div>
      <div v-else>
        <ul>
          <li v-for="recipe in data" :key="recipe.id">
            {{ recipe.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data, pending, error } = useFetch("/api/recipes");
</script>

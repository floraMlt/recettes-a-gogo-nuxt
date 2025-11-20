<template>
  <div class="px-35">
    <h1 class="mb-10 text-center text-2xl">Les recettes</h1>

    <div>
      <div v-if="isFetching">Chargement...</div>
      <div v-else-if="error">Erreur : {{ error.message }}</div>
      <div v-else>
        <ul class="flex flex-wrap justify-center gap-4">
          <RecipesCard
            v-for="recipe in data"
            :key="recipe.id"
            :recipe="recipe"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data, isFetching, error } = useFetch('/api/recipes', {
  query: { isPublic: true }
})
</script>

<template>
  <div class="relative h-full overflow-y-auto px-35">
    <h1 class="mb-10 pt-[100px] text-center text-2xl">Mes recettes</h1>

    <div class="mx-[10%] mb-15">
      <div v-if="isFetching">Chargement...</div>
      <div v-else-if="error">Erreur : {{ error.message }}</div>
      <div v-else>
        <div class="flex flex-wrap justify-center gap-4">
          <RecipesCard
            v-for="recipe in data"
            :key="recipe.id"
            :recipe="recipe"
          />
        </div>
      </div>
    </div>

    <NuxtImg
      src="/img/recipe3.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 800px) 80px, (max-width: 1500px) 10vw, 150px"
      class="absolute bottom-[4%] left-0 w-[10%] max-w-[150px] min-w-20"
    />

    <NuxtImg
      src="/img/recipe1.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 800px) 80px, (max-width: 1500px) 10vw, 150px"
      class="absolute top-[6%] right-[3%] w-[10%] max-w-[150px] min-w-20 rotate-300"
    />
  </div>
</template>

<script setup>
const userId = ref(null)

const { data: userData } = useAuth()
userId.value = userData.value?.user?.id

const { data, isFetching, error } = useFetch('/api/recipes', {
  query: { authorId: userId.value }
})
</script>

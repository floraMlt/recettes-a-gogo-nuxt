<template>
  <div
    class="flex-column relative flex h-full min-h-screen justify-center overflow-y-auto px-35 pb-20"
  >
    <div class="mt-[100px] h-fit rounded-xl bg-white p-[50px]">
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

    <NuxtImg
      src="/img/list1.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 400px) 100px, (max-width: 1200px) 25vw, 300px"
      class="absolute top-[7%] right-[10%] w-[25%] max-w-[300px] min-w-[100px]"
    />

    <NuxtImg
      src="/img/list2.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 500px) 70px, (max-width: 1071px) 14vw, 150px"
      class="absolute top-[20%] left-10 w-[14%] max-w-[150px] min-w-[70px]"
    />

    <NuxtImg
      src="/img/list3.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 500px) 60px, (max-width: 1000px) 12vw, 120px"
      class="absolute bottom-0 left-[20%] w-[12%] max-w-[120px] min-w-[60px]"
    />
  </div>
</template>

<script setup>
const { data, isFetching, error } = useFetch('/api/recipes', {
  query: { isPublic: true }
})
</script>

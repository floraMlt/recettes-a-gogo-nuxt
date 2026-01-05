<template>
  <div class="relative h-full min-h-screen overflow-y-auto px-35 pb-20">
    <div
      class="bg-secondary-light mt-[100px] h-fit min-h-[50%] rounded-xl p-10"
    >
      <h1 class="mb-10 text-center text-2xl">Mes recettes</h1>

      <div class="mb-15">
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
        sizes="(max-width: 700px) 70px, (max-width: 1100px) 8vw, 110px"
        class="absolute top-[80vh] left-0 w-[8%] max-w-[110px] min-w-20"
      />

      <NuxtImg
        src="/img/recipe1.png"
        alt="Image d'illustration"
        format="webp"
        sizes="(max-width: 600px) 60px, (max-width: 1300px) 9vw, 130px"
        class="absolute top-[6%] right-[5%] w-[9%] max-w-[130px] min-w-20 rotate-300"
      />
    </div>
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

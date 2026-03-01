<template>
  <div
    class="my-recipes-page relative flex h-full min-h-screen w-full justify-center overflow-y-auto px-1 pb-20 md:px-35"
  >
    <div
      class="bg-secondary-light mt-[9vh] h-fit min-h-[50%] min-w-[95%] rounded-xl p-1 pb-10 md:w-[80%] md:p-10"
    >
      <h1 class="mt-5 mb-4 text-center text-2xl md:mt-0 md:mb-10">
        Mes recettes
      </h1>

      <div
        class="mx-4 mb-8 flex flex-col gap-4 md:mx-0 md:flex-row md:items-center md:justify-center"
      >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une recette..."
          class="focus:border-secondary-600 w-full rounded-lg border border-gray-300 px-3 py-1 outline-none md:w-82"
        />

        <label class="flex cursor-pointer items-center gap-2">
          <input
            v-model="showFavoritesOnly"
            type="checkbox"
            class="accent-secondary-600 text-secondary-600 h-4 w-4 rounded border-gray-300 hover:cursor-pointer"
          />
          <p>Favoris uniquement</p>
        </label>
      </div>

      <div class="mb-15">
        <div v-if="isFetching">Chargement...</div>

        <div v-else-if="error">Erreur : {{ error.message }}</div>

        <div v-else-if="data && data.length === 0">
          <p class="text-center">
            {{
              searchQuery || showFavoritesOnly
                ? 'Aucune recette trouvée'
                : "Vous n'avez pas encore de recettes"
            }}
          </p>
        </div>

        <div v-else>
          <div class="flex flex-wrap justify-center gap-4">
            <RecipesCard
              v-for="recipe in data"
              :key="recipe.id"
              :recipe="recipe"
              class="w-[90%] md:w-auto md:min-w-[230px]"
            />
          </div>
        </div>
      </div>

      <NuxtImg
        src="/img/recipe3.png"
        alt="Image d'illustration"
        format="webp"
        sizes="(max-width: 700px) 70px, (max-width: 1100px) 8vw, 110px"
        class="absolute top-[80vh] left-0 hidden w-[8%] max-w-[110px] min-w-20 md:block"
      />

      <NuxtImg
        src="/img/recipe1.png"
        alt="Image d'illustration"
        format="webp"
        sizes="(max-width: 600px) 60px, (max-width: 1300px) 9vw, 130px"
        class="absolute top-[15vh] right-[5%] hidden w-[9%] max-w-[130px] min-w-20 rotate-300 md:block"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const userId = ref(null)
const searchQuery = ref('')
const showFavoritesOnly = ref(false)

const { data: userData } = useAuth()
userId.value = userData.value?.user?.id

const queryParams = computed(() => {
  const params = { authorId: userId.value, sort: 'recent' }

  if (searchQuery.value) {
    params.search = searchQuery.value
  }

  if (showFavoritesOnly.value) {
    params.favoritesOnly = true
    params.favoriteUserId = userId.value
  }

  return params
})

const { data, isFetching, error, refresh } = useFetch('/api/recipes', {
  query: queryParams,
  watch: false
})

const debouncedRefresh = useDebounceFn(() => {
  refresh()
}, 300)

watch([searchQuery, showFavoritesOnly], () => {
  debouncedRefresh()
})
</script>

<style scoped>
.my-recipes-page input[type='checkbox']:checked {
  background-color: var(--color-secondary-600);
  border-color: var(--color-secondary-600);
}
</style>

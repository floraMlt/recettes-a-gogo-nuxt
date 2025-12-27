<template>
  <div
    class="relative flex h-full min-h-screen flex-col items-center justify-center"
  >
    <div
      class="bg-secondary-light mt-[10vh] flex min-h-[50%] w-[80%] flex-col items-center rounded-2xl py-12"
    >
      <h1 class="text-primary-700 mb-6 text-center text-3xl font-bold">
        Bienvenue sur Recettes à gogo !
      </h1>

      <Button
        variant="outline"
        class="bg-secondary-200 text-primary-600 hover:text-primary-600 hover:bg-secondary-light mr-2 mb-10 hover:cursor-pointer"
        @click="$router.push('/recipes/create')"
      >
        <Plus />

        Créer une nouvelle recette
      </Button>

      <h5 class="mb-3 text-center text-xl">Vos dernières recettes</h5>

      <div v-if="fetchingRecipes">Chargement...</div>
      <div v-else-if="recipesError">
        Erreur lors du chargement des recettes.
      </div>
      <div v-else class="flex flex-wrap items-center justify-center gap-3">
        <RecipesCard
          v-for="recipe in recipes"
          :key="`recipe-${recipe.id}`"
          :recipe="recipe"
        />
      </div>
    </div>

    <NuxtImg
      src="/img/home1.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 650px) 120px, (max-width: 1100px) 18vw, 250px"
      class="absolute top-[4%] right-0 w-[18%] max-w-[200px] min-w-[120px] rotate-18"
    />

    <NuxtImg
      src="/img/home2.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 714px) 200px, (max-width: 1250px) 28vw, 310px"
      class="absolute bottom-0 left-0 w-[28%] max-w-[310px] min-w-[200px]"
    />

    <NuxtImg
      src="/img/home3.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 650px) 120px, (max-width: 1100px) 18vw, 250px"
      class="absolute right-0 bottom-0 w-[18%] max-w-[200px] min-w-[120px]"
    />

    <NuxtImg
      src="/img/home4.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 666px) 80px, (max-width: 1083px) 12vw, 110px"
      class="absolute top-[18%] left-[8%] w-[12%] max-w-[110px] min-w-20"
    />
  </div>
</template>

<script setup>
import { Plus } from 'lucide-vue-next'

const { data } = useAuth()
const {
  data: recipes,
  isFetching: fetchingRecipes,
  error: recipesError
} = useFetch('/api/recipes', {
  query: { authorId: data.value?.user?.id, limit: 3, sort: 'recent' }
})

definePageMeta({
  title: 'Home Page',
  meta: [
    { name: 'description', content: 'This is the home page of my Nuxt app.' }
  ]
})
</script>

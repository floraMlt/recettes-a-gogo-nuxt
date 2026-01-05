<template>
  <div class="relative h-full min-h-screen overflow-y-auto px-[20vw] pb-20">
    <div
      class="mt-[10vh] min-w-[60vw] rounded-lg bg-white px-[8%] py-[50px] sm:mt-[100px]"
    >
      <Loader v-if="isFetching" />

      <div v-if="!isFetching && recipe" class="mb-5">
        <div class="flex justify-between text-center">
          <div class="mx-auto w-[80%] pl-[55px]">
            <Badge class="mb-2">{{ categoriesName[recipe.category] }}</Badge>

            <h1 class="text-3xl">{{ recipe.title }}</h1>

            <p class="mt-1 italic">
              {{ recipe.description }}
            </p>
          </div>

          <div class="flex">
            <RouterLink :to="`/recipes/edit/${recipe.id}`">
              <Pen class="mr-2 hover:cursor-pointer" />
            </RouterLink>
            <Star
              :fill="recipe.favorite ? '#fbad71' : 'none'"
              color="#fbad71"
              class="hover:cursor-pointer"
              @click="updateFavorites"
            />
          </div>
        </div>

        <div class="flex-column my-8 flex gap-10">
          <div class="r w-[30%]">
            <NuxtImg
              src="/img/home1.png"
              alt="Image de la recette"
              format="webp"
              sizes="(max-width: 1200px) 100vw, 1200px"
              class="bg-secondary-light pointer-events-none h-auto max-h-[250px] w-full rounded-lg object-cover"
            />
          </div>

          <div class="w-[60%]">
            <h2 class="mt-4 mb-2 text-center text-xl">Ingrédients :</h2>

            <div class="grid grid-cols-2 gap-2 md:grid">
              <p
                v-for="(ingredient, index) in recipe.ingredients"
                :key="index"
                class="flex items-center gap-1.5"
              >
                <CircleSmall size="12px" fill="#795f6b" />
                {{
                  `${ingredient.ingredient.title} (${ingredient.quantity} ${units[ingredient.ingredient.unit]})`
                }}
              </p>
            </div>

            <div class="justify-self-right mt-8 flex">
              <div v-if="recipe.preparationTime" class="mr-4 flex">
                <AlarmClock class="mr-1.5 size-5" />
                {{ convertMinToHours(recipe.preparationTime) }}
              </div>

              <div v-if="recipe.cookingTime" class="flex">
                <CookingPot class="mr-1.5 size-5" />
                {{ convertMinToHours(recipe.cookingTime) }}
              </div>
            </div>
          </div>
        </div>

        <div class="border-primary-200 rounded-lg border p-2">
          <div
            v-for="(instruction, index) in recipe.instructions"
            :key="index"
            class="flex items-center gap-1.5"
          >
            <CircleSmall size="16px" />
            {{ instruction }}
          </div>
        </div>
      </div>
    </div>

    <NuxtImg
      src="/img/recipe1.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 857px) 60px, (max-width: 1143px) 7vw, 80px"
      class="absolute top-[26%] right-[25%] w-[5%] max-w-20 min-w-[60px]"
    />

    <NuxtImg
      src="/img/recipe2.png"
      alt="Image d'illustration"
      sizes="(max-width: 1167px) 70px, (max-width: 1667px) 6vw, 100px"
      class="absolute right-0 bottom-[10%] w-[6%] max-w-[100px] min-w-[70px]"
    />

    <NuxtImg
      src="/img/recipe3.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 583px) 70px, (max-width: 833px) 12vw, 100px"
      class="absolute bottom-[40%] left-0 w-[12%] max-w-[100px] min-w-[70px]"
    />

    <NuxtImg
      src="/img/recipe4.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 1500px) 60px, (max-width: 2500px) 4vw, 100px"
      class="absolute top-[16%] left-[30%] w-[4%] max-w-[100px] min-w-[60px]"
    />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

import { Badge } from '@/components/ui/badge'

import { AlarmClock, CookingPot, Star, CircleSmall, Pen } from 'lucide-vue-next'
import { convertMinToHours } from '@/helpers/convertMinToHours'
import categoriesName from '@/constants/CategoriesName'
import units from '@/constants/Units'

const route = useRoute()
const recipeId = route.params.id
const userId = ref(null)

const { data: userData } = await useAuth()
userId.value = userData.value?.user?.id

const { data: recipe, isFetching } = await useFetch(
  `/api/recipes/${recipeId}?userId=${userId.value}`
)

const updateFavorites = async () => {
  await $fetch(`/api/recipes/${recipeId}`, {
    method: 'PATCH',
    body: { favorites: !recipe.value.favorite, userId: userId.value }
  })

  recipe.value.favorite = !recipe.value.favorite
}
</script>

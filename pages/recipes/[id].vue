<template>
  <div
    class="relative h-full min-h-screen w-screen overflow-y-auto px-4 pb-20 md:px-[20vw]"
  >
    <div
      class="mt-[8vh] min-w-[60vw] rounded-lg bg-white px-3 py-5 sm:mt-[100px] md:mt-[10vh] md:px-[8%] md:py-[50px]"
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
              <PenIcon
                class="mr-2 transition-transform duration-320 hover:scale-110 hover:rotate-3 hover:cursor-pointer"
              />
            </RouterLink>

            <StarIcon
              :fill="recipe.favorite ? '#fbad71' : 'none'"
              color="#fbad71"
              class="transition-transform duration-320 hover:scale-110 hover:rotate-3 hover:cursor-pointer"
              @click="updateFavorites"
            />
          </div>
        </div>

        <div class="flex-column my-8 flex gap-4 md:gap-10">
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
            <h2 class="mb-2 text-left text-xl md:mt-4 md:text-center">
              Ingrédients :
            </h2>

            <div class="grid grid-cols-1 gap-2 md:grid md:grid-cols-2">
              <p
                v-for="(ingredient, index) in recipe.ingredients"
                :key="index"
                class="flex items-center gap-1.5"
              >
                <CircleSmallIcon size="12px" fill="#795f6b" />
                {{
                  `${ingredient.ingredient.title} (${ingredient.quantity} ${units[ingredient.ingredient.unit]})`
                }}
              </p>
            </div>

            <div class="justify-self-right mt-8 flex">
              <div v-if="recipe.preparationTime" class="mr-4 flex">
                <AlarmClockIcon class="mr-1.5 size-5" />
                {{ convertMinToHours(recipe.preparationTime) }}
              </div>

              <div v-if="recipe.cookingTime" class="flex">
                <CookingPotIcon class="mr-1.5 size-5" />
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
            <CircleSmallIcon size="16px" />
            <p>
              {{ instruction }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <NuxtImg
      src="/img/recipe1.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 857px) 60px, (max-width: 1143px) 7vw, 80px"
      class="absolute top-[26%] right-[25%] hidden w-[5%] max-w-20 min-w-[60px] md:block"
    />

    <NuxtImg
      src="/img/recipe2.png"
      alt="Image d'illustration"
      sizes="(max-width: 1167px) 70px, (max-width: 1667px) 6vw, 100px"
      class="absolute right-0 bottom-[10%] hidden w-[6%] max-w-[100px] min-w-[70px] md:block"
    />

    <NuxtImg
      src="/img/recipe3.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 583px) 70px, (max-width: 833px) 12vw, 100px"
      class="absolute bottom-[40%] left-0 hidden w-[12%] max-w-[100px] min-w-[70px] md:block"
    />

    <NuxtImg
      src="/img/recipe4.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 1500px) 60px, (max-width: 2500px) 4vw, 100px"
      class="absolute top-[16%] left-[30%] hidden w-[4%] max-w-[100px] min-w-[60px] md:block"
    />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

import { Badge } from '@/components/ui/badge'

import {
  AlarmClockIcon,
  CookingPotIcon,
  StarIcon,
  CircleSmallIcon,
  PenIcon
} from 'lucide-vue-next'
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

<template>
  <div class="mt-12 px-[20%]">
    <Loader v-if="isFetching" />

    <Card v-if="!isFetching && recipe" class="mb-5">
      <CardHeader class="flex justify-between">
        <div>
          <CardTitle>{{ recipe.title }}</CardTitle>
          <CardDescription class="mt-2">
            {{ recipe.description }}
          </CardDescription>
          <Badge>{{ categoriesName[recipe.category] }}</Badge>
        </div>

        <div class="flex">
          <Pen class="mr-2 hover:cursor-pointer" />
          <Star class="hover:cursor-pointer" @click="updateFavorites" />
        </div>
      </CardHeader>

      <CardContent class="flex-column flex">
        <div v-if="recipe.preparationTime" class="mr-4 flex">
          <AlarmClock class="mr-1.5 size-5" />
          {{ convertMinToHours(recipe.preparationTime) }}
        </div>

        <div v-if="recipe.cookingTime" class="flex">
          <CookingPot class="mr-1.5 size-5" />
          {{ convertMinToHours(recipe.cookingTime) }}
        </div>
      </CardContent>
    </Card>

    <div
      v-for="instruction in recipe.instructions"
      :key="recipe.id"
      class="flex items-center gap-1.5"
    >
      <CircleSmall size="16px" />
      {{ instruction }}
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { AlarmClock, CookingPot, Star, CircleSmall, Pen } from 'lucide-vue-next'
import { convertMinToHours } from '@/helpers/convertMinToHours'
import categoriesName from '@/constants/categoriesName'

const route = useRoute()
const recipeId = route.params.id
const userId = ref(null)

const { data: userData } = useAuth()
userId.value = userData.value?.id

const { data: recipe, isFetching } = await useFetch(`/api/recipes/${recipeId}`)


const updateFavorites = async (value) => {
  const { data, status, error, isFetching } = useFetch(
    `/api/recipes/${recipeId}/favorite`,
    {
      method: 'PATCH',
      body: { favorites: !recipe.value.favorite }
    }
  )
}
</script>

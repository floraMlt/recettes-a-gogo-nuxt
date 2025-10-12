<template>
  <div class="mt-12 px-[20%]">
    <Loader v-if="isFetching" />

    <Card v-if="!isFetching && recipe">
      <CardHeader class="flex justify-between">
        <div>
          <CardTitle>{{ recipe.title }}</CardTitle>
          <CardDescription class="mt-2">
            {{ recipe.description }}
          </CardDescription>
        </div>

        <Star class="hover:cursor-pointer" @click="updateFavorites" />
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

import { AlarmClock, CookingPot, Star } from 'lucide-vue-next'
import { convertMinToHours } from '@/helpers/convertMinToHours'

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

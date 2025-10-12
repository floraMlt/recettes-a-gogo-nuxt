<template>
  <Card
    class="w-[250px] hover:shadow-md hover:cursor-pointer"
    @click="goToRecipeDetails"
  >
    <CardHeader>
      <CardTitle>{{ recipe.title }}</CardTitle>
      <CardDescription>{{ recipe.description }}</CardDescription>
    </CardHeader>

    <CardContent class="flex flex-column">
      <div v-if="recipe.preparationTime" class="flex mr-4">
        <AlarmClock class="size-5 mr-1.5" />
        {{ convertMinToHours(recipe.preparationTime) }}
      </div>

      <div v-if="recipe.cookingTime" class="flex">
        <CookingPot class="size-5 mr-1.5" />
        {{ convertMinToHours(recipe.cookingTime) }}
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { useRouter } from 'vue-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { AlarmClock, CookingPot } from 'lucide-vue-next'
import { convertMinToHours } from '@/helpers/convertMinToHours'

const router = useRouter()

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const goToRecipeDetails = () => {
  router.push(`/recipes/${props.recipe.id}`)
}
</script>

<template>
  <Card
    class="z-10 w-[250px] gap-2 pt-2 pb-4 shadow-none transition-shadow hover:cursor-pointer hover:shadow-sm"
    @click="goToRecipeDetails"
  >
    <SignedImage
      :file-name="recipe.imageFileName"
      :initial-url="recipe.imageUrl"
      alt="Image de la recette"
      class="bg-secondary-100 pointer-events-none mx-2 h-[150px] w-auto rounded-lg bg-[url('/img/home2.png')] bg-cover bg-center"
    />

    <CardHeader>
      <CardTitle class="mt-3">{{ recipe.title }}</CardTitle>
      <CardDescription>{{ recipe.description }}</CardDescription>
    </CardHeader>

    <CardContent class="flex-column flex">
      <div v-if="recipe.preparationTime" class="mr-4 flex">
        <AlarmClockIcon class="mr-1.5 size-5" />
        {{ convertMinToHours(recipe.preparationTime) }}
      </div>

      <div v-if="recipe.cookingTime" class="flex">
        <CookingPotIcon class="mr-1.5 size-5" />
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

import { AlarmClockIcon, CookingPotIcon } from 'lucide-vue-next'
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

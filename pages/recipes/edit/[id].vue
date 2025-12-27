<template>
  <div
    class="direction-column flex h-full min-h-screen flex-col items-center justify-center pb-8"
  >
    <h1 class="font-playfair mt-[10vh] mb-7 text-center text-2xl sm:mt-[100px]">
      Edition de la recette
    </h1>

    <form
      class="grid w-fit max-w-[80vw] min-w-[70%] grid-cols-1 gap-x-8 gap-y-4 rounded-xl bg-white p-8 text-sm md:grid-cols-2"
      @submit.prevent="editRecipe"
    >
      <CustomInput
        name="title"
        label="Titre"
        placeholder="Titre de la recette"
      />
      <CustomInput
        name="description"
        label="Description"
        placeholder="Description de la recette"
      />
      <CustomInput
        name="preparationTime"
        label="Temps de préparation (en minutes)"
      />
      <CustomInput name="cookingTime" label="Temps de cuisson (en minutes)" />

      <CustomSelect
        v-model="values.category"
        name="category"
        label="Catégorie"
        placeholder="Sélectionner une catégorie"
        input-class="w-full"
        :options="categoriesList"
      />

      <CustomTagsInput name="tags" label="Tags" placeholder="Tags" />

      <div>
        <p class="mb-1.5 font-medium">Ingrédients</p>
        <Loader v-if="isFetching" />
        <div v-else>
          <CustomMultiSelect
            v-model="selectedIngredientIds"
            name="ingredients"
            placeholder="Sélectionner des ingrédients"
            :options="fetchedIngredients"
          />

          <div
            v-for="ingredient in ingredients"
            v-if="ingredients.length"
            :key="`ingredient-${getIngredientData(ingredient.ingredientId).title}`"
            class="mt-2 ml-5 flex items-center gap-2"
          >
            <div class="m-w-fit w-25">
              <CustomNumber
                v-model="ingredient.quantity"
                :name="`quantity-${getIngredientData(ingredient.ingredientId).title}`"
                label="Quantité"
              />
            </div>

            <p v-if="ingredient" class="mt-5">
              {{
                `${getIngredientData(ingredient.ingredientId).title} (${units[getIngredientData(ingredient.ingredientId).unit]})`
              }}
            </p>
          </div>
        </div>
      </div>

      <div>
        <p class="mb-1.5 font-medium">Instructions</p>

        <div
          v-for="(instruction, index) in instructions"
          :key="`instruction-${index}`"
          class="mb-4"
        >
          <div class="flex items-center gap-1">
            <CustomTextarea
              v-model="instructions[index]"
              :name="`instruction-${index}`"
              :label="`Étape ${index + 1}`"
              input-class="w-full"
              placeholder="Décrivez cette étape..."
            />

            <Trash2
              v-if="instructions.length > 1 && index > 0"
              class="mt-3 size-4.5 text-red-600 hover:cursor-pointer hover:opacity-80"
              @click="removeInstruction(index)"
            />
          </div>
        </div>

        <Button
          type="button"
          class="mt-4 hover:cursor-pointer"
          @click="addInstruction"
        >
          + Ajouter une instruction
        </Button>
      </div>

      <div>
        <CustomCheckbox name="isPublic" label="Recette publique" />

        <Button
          class="mt-5 ml-auto w-[100px] hover:cursor-pointer"
          type="submit"
        >
          Éditer
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watchEffect, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Trash2 } from 'lucide-vue-next'
import { useAuth } from '#imports'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'

import CustomInput from '@/components/inputs/CustomInput'
import CustomMultiSelect from '@/components/inputs/CustomMultiSelect'
import CustomSelect from '@/components/inputs/CustomSelect'
import CustomTagsInput from '@/components/inputs/CustomTagsInput'
import CustomTextarea from '@/components/inputs/CustomTextarea'
import CustomNumber from '@/components/inputs/CustomNumber'
import CustomCheckbox from '@/components/inputs/CustomCheckbox'

import categoriesName from '@/constants/CategoriesName'
import units from '@/constants/Units'

const router = useRouter()

const ingredients = ref([])
const selectedIngredientIds = ref([])
const fetchedIngredients = ref([])
const instructions = ref([''])
const initialRecipe = ref({})

const categoriesList = Object.entries(categoriesName).map(([key, value]) => ({
  title: value,
  value: key
}))

const { data, isFetching } = useFetch('/api/ingredients')
const { data: session } = useAuth()
const { data: recipeData } = await useFetch(
  `/api/recipes/${router.currentRoute.value.params.id}`
)
const formInitialized = ref(false)

watchEffect(() => {
  if (data.value) fetchedIngredients.value = data.value
})

const validationSchema = toTypedSchema(
  z.object({
    title: z.string().min(2),
    description: z.string().min(2).optional(),
    ingredients: z.array(z.string()).min(1),
    instructions: z.string().min(2).optional(),
    preparationTime: z
      .string()
      .refine((val) => !val || /^\d+$/.test(val), {
        message: 'Doit être un nombre entier'
      })
      .optional(),
    cookingTime: z
      .string()
      .refine((val) => !val || /^\d+$/.test(val), {
        message: 'Doit être un nombre entier'
      })
      .optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPublic: z.boolean().default(false)
  })
)

const { values, resetForm } = useForm({
  validationSchema
})

watchEffect(() => {
  if (!recipeData.value || formInitialized.value) return

  const recipe = recipeData.value
  initialRecipe.value = JSON.parse(
    JSON.stringify({
      title: recipe.title,
      description: recipe.description,
      preparationTime: recipe.preparationTime,
      cookingTime: recipe.cookingTime,
      category: recipe.category,
      tags: recipe.tags?.map((t) => t.tag.name) || [],
      isPublic: recipe.isPublic,
      ingredients:
        recipe.ingredients?.map((i) => ({
          ingredientId: i.ingredient.id,
          quantity: i.quantity
        })) || [],
      instructions: recipe.instructions || [],
      authorId: recipe.authorId
    })
  )

  ingredients.value = JSON.parse(
    JSON.stringify(initialRecipe.value.ingredients)
  )

  selectedIngredientIds.value = initialRecipe.value.ingredients.map(
    (i) => i.ingredientId
  )

  instructions.value = JSON.parse(
    JSON.stringify(initialRecipe.value.instructions)
  )

  resetForm({
    values: {
      ...initialRecipe.value,
      preparationTime: recipe.preparationTime
        ? recipe.preparationTime.toString()
        : '',
      cookingTime: recipe.cookingTime ? recipe.cookingTime.toString() : ''
    }
  })

  formInitialized.value = true
})

watch(
  selectedIngredientIds,
  (newIds) => {
    if (!Array.isArray(newIds)) {
      newIds = newIds ? [newIds] : []
    }

    newIds.forEach((id) => {
      if (!ingredients.value.some((it) => it.ingredientId === id)) {
        ingredients.value.push({ ingredientId: id, quantity: null })
      }
    })
  },
  { immediate: true }
)

const diffObject = (initial, current) => {
  const result = {}

  for (const key in current) {
    if (JSON.stringify(current[key]) !== JSON.stringify(initial[key])) {
      result[key] = current[key]
    }
  }

  return result
}

const editRecipe = async () => {
  const userId = session.value?.user?.id

  const currentRecipe = {
    title: values.title,
    description: values.description,
    preparationTime: values.preparationTime
      ? Number(values.preparationTime)
      : null,
    cookingTime: values.cookingTime ? Number(values.cookingTime) : null,
    category: values.category || null,
    tags: values.tags || [],
    isPublic: values.isPublic,
    ingredients: ingredients.value.map((i) => ({
      ingredientId: i.ingredientId,
      quantity:
        i.quantity !== '' && i.quantity != null ? Number(i.quantity) : null
    })),
    instructions: instructions.value.filter((i) => i.trim().length > 0),
    authorId: userId
  }

  const payload = diffObject(initialRecipe.value, currentRecipe)

  const { error, data: updatedRecipe } = await useFetch(
    `/api/recipes/${router.currentRoute.value.params.id}`,
    {
      method: 'PATCH',
      body: payload
    }
  )

  if (!error.value) {
    router.push(`/recipes/${updatedRecipe.value.id}`)
    toast('Recette éditée', { description: 'Votre recette a bien été éditée.' })
  }
}

const getIngredientData = (id) => {
  return fetchedIngredients.value.find((ing) => ing.id === id)
}

const addInstruction = () => {
  instructions.value.push('')
}

const removeInstruction = (index) => {
  instructions.value.splice(index, 1)
}
</script>

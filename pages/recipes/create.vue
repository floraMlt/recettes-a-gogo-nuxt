<template>
  <div
    class="direction-column flex h-full flex-col items-center justify-center"
  >
    <h1 class="mt-2 mb-7 text-center text-2xl">Nouvelle recette</h1>

    <form
      class="flex h-full w-[40%] min-w-[300px] flex-col gap-6 rounded-xl
        bg-neutral-100 p-8 text-sm"
      @submit.prevent="createRecipe"
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
        name="category"
        placeholder="Sélectionner une catégorie"
        :options="categoriesList"
        @change="(val) => setFieldValue('category', val)"
      />

      <div>
        <p class="mb-1.5 font-medium">Ingrédients</p>
        <Loader v-if="isFetching" />
        <div v-else>
          <CustomMultiSelect
            name="ingredients"
            placeholder="Sélectionner des ingrédients"
            :options="fetchedIngredients"
            @change="
              (value) => {
                ingredients = value
                setFieldValue('ingredients', value)
              }
            "
          />

          <div
            v-if="ingredients.length"
            v-for="ingredient in ingredients"
            :key="`ingredient-${ingredient}`"
            class="mt-2 ml-5 flex items-center gap-2"
          >
            <div class="m-w-fit w-25">
              <CustomInput
                :name="`quantity-${ingredient}`"
                placeholder="Quantité"
              />
            </div>

            <p v-if="getIngredientData(ingredient)" class="mt-2">
              {{
                `${getIngredientData(ingredient).title} (${units[getIngredientData(ingredient).unit]})`
              }}
            </p>
          </div>
        </div>
      </div>

      <CustomInput
        name="instructions"
        label="Instructions"
        placeholder="Vos instructions..."
        type="textarea"
      />

      <CustomTagsInput
        name="tags"
        placeholder="Tags"
        @change="(val) => setFieldValue('tags', val)"
      />

      <Button class="mt-[20px] ml-auto w-[100px]" type="submit"> Créer </Button>
    </form>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import CustomInput from '@/components/inputs/CustomInput'
import CustomMultiSelect from '@/components/inputs/CustomMultiSelect'
import CustomSelect from '@/components/inputs/CustomSelect'
import CustomTagsInput from '@/components/inputs/CustomTagsInput'

import categoriesName from '@/constants/categoriesName'

// const title = ref('')
// const description = ref('')
const ingredients = ref([])
// const instructions = ref('')
// const categories = ref('')
// const tags = ref([])
// const preparationTime = ref('10')
// const cookingTime = ref('0')

const fetchedIngredients = ref([])

const categoriesList = Object.entries(categoriesName).map(([key, value]) => ({
  title: value,
  value: key
}))

const { data, isFetching } = useFetch('/api/ingredients')

watchEffect(() => {
  if (data.value) {
    fetchedIngredients.value = data.value
  }
})

const units = {
  unit: 'unité',
  liter: 'litre',
  centiliter: 'centilitre',
  gram: 'gramme',
  kilogram: 'kilogramme',
  tablespoon: 'cuillère à soupe',
  teaspoon: 'cuillère à café',
  pinch: 'pincée',
  bunch: 'botte'
}

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
    tags: z.array(z.string()).optional()
  })
)

const { values, errors, handleSubmit, setFieldValue } = useForm({
  validationSchema
})

const createRecipe = async () => {
  const { error, isFetching: isPosting } = await useFetch('/api/recipes', {
    method: 'POST',
    body: {
      title: values.value.title,
      description: values.value.description,
      ingredients: values.value.ingredients,
      instructions: values.value.instructions,
      preparationTime: values.value.preparationTime
        ? parseInt(values.value.preparationTime)
        : null,
      cookingTime: values.value.cookingTime
        ? parseInt(values.value.cookingTime)
        : null,
      category: values.value.category || null,
      tags: values.value.tags || []
    }
  })
}

const getIngredientData = (id) => {
  return fetchedIngredients.value.find((ing) => ing.id === id)
}
</script>

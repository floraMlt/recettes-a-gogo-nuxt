<template>
  <div
    class="direction-column flex h-full flex-col items-center justify-center
      pb-8"
  >
    <h1 class="mt-2 mb-7 text-center text-2xl">Nouvelle recette</h1>

    <form
      class="grid w-fit max-w-[80vw] min-w-[70%] grid-cols-1 gap-x-8 gap-y-4
        rounded-xl bg-neutral-100 p-8 text-sm md:grid-cols-2"
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
        label="Catégorie"
        placeholder="Sélectionner une catégorie"
        input-class="w-full"
        :options="categoriesList"
        @change="(e) => setFieldValue('category', e.target.value)"
      />

      <CustomTagsInput name="tags" label="Tags" placeholder="Tags" />

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
            v-for="ingredient in ingredients"
            v-if="ingredients.length"
            :key="`ingredient-${ingredient}`"
            class="mt-2 ml-5 flex items-center gap-2"
          >
            <div class="m-w-fit w-25">
              <CustomNumber :name="`quantity-${ingredient}`" label="Quantité" />
            </div>

            <p v-if="getIngredientData(ingredient)" class="mt-5">
              {{
                `${getIngredientData(ingredient).title} (${units[getIngredientData(ingredient).unit]})`
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
              class="mt-3 size-4.5 text-red-600 hover:cursor-pointer
                hover:opacity-80"
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
          class="mt-[20px] ml-auto w-[100px] hover:cursor-pointer"
          type="submit"
        >
          Créer
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
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

import categoriesName from '@/constants/categoriesName'

const router = useRouter()

const ingredients = ref([])
const fetchedIngredients = ref([])
const instructions = ref([''])

const categoriesList = Object.entries(categoriesName).map(([key, value]) => ({
  title: value,
  value: key
}))

const { data, isFetching } = useFetch('/api/ingredients')
const { data: session } = useAuth()

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
    tags: z.array(z.string()).optional(),
    isPublic: z.boolean().default(false)
  })
)

const { values, setFieldValue } = useForm({
  validationSchema
})

const createRecipe = async () => {
  const userId = session.value?.user?.id

  const formattedInstructions = instructions.value.filter(
    (i) => i.trim().length > 0
  )

  let formattedIngredients = []

  if (ingredients.value.length > 0) {
    const quantities = ingredients.value.map((ingredient) => {
      const quantityValue = values?.[`quantity-${ingredient}`]
      return quantityValue ? quantityValue : null
    })

    formattedIngredients = ingredients.value.map((ingredient, index) => ({
      ingredientId: ingredient,
      quantity: quantities[index]
    }))
  }

  const { error, data: createdRecipe } = await useFetch('/api/recipes', {
    method: 'POST',
    body: {
      title: values?.title,
      description: values?.description,
      ingredients: formattedIngredients,
      instructions: formattedInstructions,
      preparationTime: values?.preparationTime
        ? parseInt(values?.preparationTime)
        : null,
      cookingTime: values?.cookingTime ? parseInt(values?.cookingTime) : null,
      category: values?.category || null,
      tags: values?.tags || [],
      isPublic: values?.isPublic,
      authorId: userId
    }
  })

  if (!error.value) {
    router.push(`/recipes/${createdRecipe.value.id}`)

    toast('Recette créée', {
      description: 'Votre recette a bien été ajoutée.',
      action: {
        label: 'Ajouter une nouvelle recette',
        onClick: () => {
          router.push('/recipes/create')
        }
      }
    })
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

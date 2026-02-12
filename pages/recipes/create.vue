<template>
  <div
    class="direction-column relative flex h-full min-h-screen flex-col items-center justify-center pb-8"
  >
    <div class="mt-[10vh] max-w-[80vw] rounded-xl bg-white p-8">
      <h1 class="mb-7 text-center text-2xl">Nouvelle recette</h1>

      <form
        class="grid w-fit min-w-[70vw] grid-cols-1 gap-x-8 gap-y-4 text-sm md:grid-cols-2"
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
            <CustomAutocomplete
              v-model:search-term="searchQuery"
              name="ingredients"
              placeholder="Rechercher des ingrédients"
              :options="searchResults"
              :is-loading="isSearching"
              @change="handleSelection"
            >
              <template #dialog>
                <AddIngredientDialog
                  :ingredient-title="searchQuery"
                  @ingredient-created="handleIngredientCreated"
                />
              </template>
            </CustomAutocomplete>

            <div
              v-for="ingredient in ingredients"
              v-if="ingredients.length"
              :key="`ingredient-${getIngredientData(ingredient.ingredientId).title}`"
              class="mt-2 ml-3 flex items-center justify-between gap-2"
            >
              <p v-if="ingredient">
                {{
                  `${getIngredientData(ingredient.ingredientId).title} (${units[getIngredientData(ingredient.ingredientId).unit]})`
                }}
              </p>

              <div class="m-w-fit flex items-center">
                <div class="w-25">
                  <CustomNumber
                    v-model="ingredient.quantity"
                    :name="`quantity-${ingredient.ingredientId}`"
                  />
                </div>

                <XIcon
                  class="mt-2 ml-3 size-4.5 text-red-600 opacity-60 transition-all hover:cursor-pointer hover:opacity-100"
                  @click="
                    ingredients = ingredients.filter(
                      (i) => i.ingredientId !== ingredient.ingredientId
                    )
                  "
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <p class="mb-1.5 font-medium">Instructions</p>

          <div
            v-for="(instruction, index) in instructions"
            :key="`instruction-${index}`"
            class="mb-4 ml-3"
          >
            <div class="flex flex-col">
              <div class="flex items-center justify-between">
                <p>{{ `Étape ${index + 1}` }}</p>

                <XIcon
                  v-if="instructions.length > 1 && index > 0"
                  class="size-4.5 text-red-600 opacity-60 transition-all hover:cursor-pointer hover:opacity-100"
                  @click="removeInstruction(index)"
                />
              </div>

              <CustomTextarea
                v-model="instructions[index]"
                :name="`instruction-${index}`"
                input-class="w-full"
                placeholder="Décrivez cette étape..."
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
          <CustomInputFile
            v-model="imageUrl"
            v-model:file-name="imageFileName"
            :max-size="5 * 1024 * 1024"
            label="Image de la recette"
            class="mb-6"
          />

          <CustomCheckbox name="isPublic" label="Recette publique" />

          <Button
            class="mt-5 ml-auto w-[100px] hover:cursor-pointer"
            type="submit"
          >
            Créer
          </Button>
        </div>
      </form>
    </div>

    <NuxtImg
      src="/img/list3.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 500px) 60px, (max-width: 1000px) 12vw, 120px"
      class="absolute right-[8%] bottom-0 w-[12%] max-w-[120px] min-w-[60px]"
    />

    <NuxtImg
      src="/img/recipe4.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 1500px) 60px, (max-width: 2500px) 6vw, 130px"
      class="absolute top-[10%] left-[6%] w-[6%] max-w-[130px] min-w-[60px] rotate-15"
    />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { XIcon } from 'lucide-vue-next'
import { useAuth } from '#imports'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'

import CustomInput from '@/components/inputs/CustomInput'
import CustomAutocomplete from '@/components/inputs/CustomAutocomplete'
import CustomSelect from '@/components/inputs/CustomSelect'
import CustomTagsInput from '@/components/inputs/CustomTagsInput'
import CustomTextarea from '@/components/inputs/CustomTextarea'
import CustomNumber from '@/components/inputs/CustomNumber'
import CustomCheckbox from '@/components/inputs/CustomCheckbox'
import CustomInputFile from '@/components/inputs/CustomInputFile'
import AddIngredientDialog from '@/components/recipes/AddIngredientDialog'

import categoriesName from '@/constants/CategoriesName'
import units from '@/constants/Units'

const router = useRouter()

const ingredients = ref([])
const selectedIngredientIds = ref([])
const fetchedIngredients = ref([])
const instructions = ref([''])
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const imageUrl = ref('')
const imageFileName = ref('')

const categoriesList = Object.entries(categoriesName).map(([key, value]) => ({
  title: value,
  value: key
}))

const { data, isFetching } = useFetch('/api/ingredients')
const { data: session } = useAuth()

watchEffect(() => {
  if (data.value) fetchedIngredients.value = data.value
})

watch(searchQuery, async (newQuery) => {
  if (!newQuery || newQuery.trim().length < 2) {
    searchResults.value = []
    return
  }

  isSearching.value = true

  try {
    const { data: results } = await useFetch('/api/ingredients', {
      query: { search: newQuery }
    })

    if (results.value) {
      searchResults.value = results.value
    }
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
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
      const quantityValue = values?.[`quantity-${ingredient.ingredientId}`]
      return quantityValue ? quantityValue : null
    })

    formattedIngredients = ingredients.value.map((ingredient, index) => ({
      ingredientId: ingredient?.ingredientId,
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
      authorId: userId,
      imageUrl: imageUrl.value,
      imageFileName: imageFileName.value
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

const handleSelection = (selectedIds) => {
  selectedIngredientIds.value = selectedIds
  ingredients.value.push(
    ...selectedIds
      .filter((id) => !ingredients.value.some((ing) => ing.ingredientId === id))
      .map((id) => ({
        ingredientId: id,
        quantity: 1
      }))
  )

  searchQuery.value = ''
}

const handleIngredientCreated = (createdIngredient) => {
  fetchedIngredients.value.push(createdIngredient)
  selectedIngredientIds.value.push(createdIngredient.id)
  ingredients.value.push({
    ingredientId: createdIngredient.id,
    quantity: 1
  })
  searchQuery.value = ''
}
</script>

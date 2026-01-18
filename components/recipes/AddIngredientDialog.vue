<template>
  <Dialog v-model:open="dialogOpened">
    <DialogTrigger as-child>
      <p class="p-2.5 hover:cursor-pointer">Ajouter l'ingrédient</p>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[425px]">
      <form @submit.prevent="createIngredient">
        <DialogHeader>
          <DialogTitle>Créer un ingrédient</DialogTitle>

          <DialogDescription class="mb-5">
            Remplissez le formulaire pour ajouter un nouvel ingrédient
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4">
          <div class="grid gap-3">
            <CustomInput
              name="title"
              label="Titre"
              placeholder="Titre de l'ingrédient"
            />
          </div>

          <div class="grid gap-3">
            <CustomSelect
              :options="unitsArray"
              name="unit"
              label="Unité"
              placeholder="Sélectionner une unité"
              input-class="w-full"
            />
          </div>
        </div>

        <DialogFooter class="mt-5">
          <DialogClose as-child>
            <Button variant="outline" class="hover:cursor-pointer">
              Annuler
            </Button>
          </DialogClose>

          <Button type="submit" class="hover:cursor-pointer">
            Sauvegarder
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { toast } from 'vue-sonner'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import CustomInput from '@/components/inputs/CustomInput'
import CustomSelect from '@/components/inputs/CustomSelect'

import units from '@/constants/Units'

const props = defineProps({
  ingredientTitle: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['ingredientCreated'])

const validationSchema = toTypedSchema(
  z.object({
    title: z.string().min(2),
    unit: z.string().min(2).optional()
  })
)

const { values, setFieldValue, resetForm } = useForm({
  validationSchema
})

const unitsArray = Object.entries(units).map(([key, value]) => {
  const capitalizedValue =
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  return {
    title: capitalizedValue,
    value: key
  }
})

const dialogOpened = ref(false)

watch(dialogOpened, (isOpen) => {
  if (isOpen) {
    resetForm({
      values: {
        title: props.ingredientTitle ?? '',
        unit: unitsArray[0].value
      }
    })
  }
})

const createIngredient = async () => {
  const ingredientData = {
    title: values.title,
    unit: values.unit
  }

  const { error, data: createdIngredient } = await useFetch(
    '/api/ingredients',
    {
      method: 'POST',
      body: ingredientData
    }
  )

  if (!error.value) {
    toast("L'ingredient à bien été créé")

    dialogOpened.value = false
  }

  emit('ingredientCreated', createdIngredient.value)
}

onBeforeMount(() => {
  if (props.ingredientTitle) {
    setFieldValue('title', props.ingredientTitle)
  }
})
</script>

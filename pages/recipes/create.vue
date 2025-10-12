<template>
  <h1>Créer une recette</h1>

  <input v-model="title" placeholder="Titre de la recette" />
  <textarea v-model="description" placeholder="Description de la recette" />
  <textarea
    v-for="(ingredient, index) in ingredients"
    :key="ingredient"
    v-model="ingredients[index]"
    placeholder="Ingrédient à ajouter"
  />
  <button @click="addIngredient">Ajouter un ingrédient</button>

  <textarea
    v-for="(instruction, index) in instructions"
    :key="instruction"
    v-model="instructions[index]"
    placeholder="Instruction à ajouter"
  />
  <button @click="addInstruction">Ajouter une instruction</button>

  <button @click="createRecipe">Créer</button>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('')
const description = ref('')
const ingredients = ref([''])
const instructions = ref([''])

const addIngredient = () => {
  ingredients.value.push('')
}
const addInstruction = () => {
  instructions.value.push('')
}

const createRecipe = async () => {
  const { error, isFetching } = await useFetch('/api/recipes', {
    method: 'POST',
    body: {
      title: title.value,
      description: description.value,
      ingredients: ingredients.value,
      instructions: instructions.value
    }
  })
}
</script>

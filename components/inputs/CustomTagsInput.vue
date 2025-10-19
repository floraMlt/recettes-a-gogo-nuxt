<template>
  <TagsInput v-model="options">
    <TagsInputItem v-for="item in options" :key="item" :value="item">
      <TagsInputItemText />
      <TagsInputItemDelete />
    </TagsInputItem>

    <TagsInputInput :placeholder="placeholder" />
  </TagsInput>
</template>

<script setup>
import { ref } from 'vue'

import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText
} from '@/components/ui/tags-input'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const options = ref([])
</script>

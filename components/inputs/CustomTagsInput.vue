<template>
  <div>
    <h5 class="mb-1.5 text-sm font-medium">{{ label }}</h5>

    <TagsInput v-model="options">
      <TagsInputItem v-for="item in options" :key="item" :value="item">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>

      <TagsInputInput :placeholder="placeholder" />
    </TagsInput>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'
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
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const { value: options } = useField(props.name)
</script>

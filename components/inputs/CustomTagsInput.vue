<template>
  <div>
    <p class="mb-1.5 text-sm font-medium">{{ label }}</p>

    <TagsInput v-model="fieldValue">
      <TagsInputItem v-for="item in fieldValue" :key="item" :value="item">
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

const { value: fieldValue } = useField(props.name)
</script>

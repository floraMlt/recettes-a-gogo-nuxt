<template>
  <div class="flex items-center space-x-2">
    <Checkbox :id="name" />
    <label
      :for="name"
      class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed
        peer-disabled:opacity-70"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup>
import { Checkbox } from '@/components/ui/checkbox'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  }
})
</script>

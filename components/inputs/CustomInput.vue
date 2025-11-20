<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem v-auto-animate :class="inputClass">
      <FormLabel>{{ label }}</FormLabel>

      <FormControl>
        <Input
          v-bind="componentField"
          :type="type"
          :placeholder="placeholder"
          class="bg-secondary-100"
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup>
import { vAutoAnimate } from '@formkit/auto-animate/vue'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  inputClass: {
    type: String,
    default: ''
  }
})
</script>

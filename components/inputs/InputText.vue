<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem v-auto-animate :class="inputClass">
      <FormLabel>{{ label }}</FormLabel>

      <FormControl>
        <Input
          :type="type"
          :placeholder="placeholder"
          v-bind="componentField"
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

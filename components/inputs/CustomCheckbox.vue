<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem v-auto-animate class="flex items-center">
      <FormControl>
        <Checkbox
          class="bg-white hover:cursor-pointer"
          :checked="componentField.value"
          @update:checked="(val) => componentField.onChange(Boolean(val))"
        />
      </FormControl>

      <FormLabel>{{ label }}</FormLabel>

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
  label: {
    type: String,
    default: ''
  }
})
</script>

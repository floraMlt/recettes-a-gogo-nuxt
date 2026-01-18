<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem :class="inputClass">
      <FormLabel>{{ label }}</FormLabel>

      <FormControl>
        <NumberField
          v-bind="{
            ...componentField,
            modelValue: Number(componentField.modelValue ?? 0),
            'onUpdate:modelValue': (val) =>
              componentField['onUpdate:modelValue']?.(Number(val))
          }"
          :id="name"
          :default-value="defaultValue"
          :min="min"
          :max="max"
        >
          <NumberFieldContent>
            <NumberFieldDecrement class="hover:cursor-pointer" />
            <NumberFieldInput />
            <NumberFieldIncrement class="hover:cursor-pointer" />
          </NumberFieldContent>
        </NumberField>
      </FormControl>

      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from '@/components/ui/number-field'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  inputClass: {
    type: String,
    default: ''
  },
  defaultValue: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: Infinity
  }
})
</script>

<template>
  <div>
    <Select
      :model-value="value"
      class="bg-white"
      @update:model-value="onUpdate"
    >
      <p class="mb-1.5 text-sm font-medium">{{ label }}</p>

      <SelectTrigger class="w-full cursor-pointer bg-white">
        <SelectValue v-if="placeholder" :placeholder="placeholder" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectItem
            v-for="option in options"
            :key="`select-option-${option.value}`"
            :value="option.value"
            class="cursor-pointer"
          >
            {{ option.title }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'

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
  options: {
    type: Array,
    required: true
  }
})

const { value, handleChange } = useField(props.name)

const onUpdate = (val) => {
  handleChange(val)
}
</script>

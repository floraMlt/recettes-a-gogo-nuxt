<template>
  <div>
    <Select class="bg-white">
      <h5 class="mb-1.5 text-sm font-medium">{{ label }}</h5>

      <SelectTrigger class="w-full cursor-pointer bg-white">
        <SelectValue v-if="placeholder" :placeholder="placeholder" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel v-if="label">{{ label }}</SelectLabel>

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
</script>

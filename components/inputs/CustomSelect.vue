<template>
  <Select class="bg-white">
    <SelectTrigger class="w-[250px] cursor-pointer bg-white">
      <SelectValue v-if="placeholder" :placeholder="placeholder" />
    </SelectTrigger>

    <SelectContent>
      <SelectGroup>
        <SelectLabel v-if="label">{{ label }}</SelectLabel>

        <SelectItem
          v-for="option in options"
          :value="option.value"
          class="cursor-pointer"
        >
          {{ option.title }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
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

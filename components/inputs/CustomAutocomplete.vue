<template>
  <Command>
    <input
      v-model="localSearch"
      :placeholder="placeholder"
      class="w-full border-b p-2 outline-none focus:border-b"
    />

    <SpinnerLoader v-if="isLoading || debouncing" size="sm" class="mx-auto" />

    <CommandList v-show="!isLoading && !debouncing">
      <CommandGroup>
        <CommandItem
          v-for="option in options"
          :key="option.id"
          :value="option.title.toLowerCase()"
          class="border-secondary-100 bg-secondary-light hover:bg-secondary-100 border hover:cursor-pointer"
          @select="
            selected.includes(option.id)
              ? (selected = selected.filter((v) => v !== option.id))
              : selected.push(option.id)
          "
        >
          <span class="mr-2 flex h-4 items-center justify-center">
            {{ option.title }}
          </span>
        </CommandItem>
      </CommandGroup>

      <div
        v-if="
          localSearch &&
          localSearch.trim().length > 0 &&
          !options.some(
            (item) => item.title.toLowerCase() === localSearch.toLowerCase()
          )
        "
        :key="localSearch"
        :value="localSearch"
        class="border-secondary-100 bg-secondary-light hover:bg-secondary-100 border p-0! hover:cursor-pointer"
        @select="triggerDialog"
      >
        <slot name="dialog" />
      </div>
    </CommandList>
  </Command>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem
} from '@/components/ui/command'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['change', 'triggerDialog'])

const search = defineModel('searchTerm', {
  type: String,
  default: ''
})
const localSearch = ref(search.value)
const selected = ref([])
const debouncing = ref(false)

const debouncedFn = useDebounceFn(() => {
  search.value = localSearch.value
  debouncing.value = false
}, 1500)

watch(
  localSearch,
  () => {
    debouncing.value = true
    debouncedFn()
  },
  { deep: true }
)

watch(search, (newVal) => {
  localSearch.value = newVal
})

const triggerDialog = () => {
  emit('triggerDialog', localSearch.value)
}

watch(
  selected,
  (newVal) => {
    emit('change', newVal)
  },
  { deep: true }
)
</script>

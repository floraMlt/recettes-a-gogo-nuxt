<template>
  <Command>
    <CommandInput
      v-if="placeholder"
      :placeholder="placeholder"
      @input="onSearch"
    />

    <CommandList v-if="search.length > 0">
      <CommandEmpty>Aucun élément trouvé</CommandEmpty>

      <CommandGroup>
        <CommandItem
          v-for="option in filtered"
          :key="option.id"
          :value="option.id"
          @select="
            selected.includes(option.id)
              ? (selected = selected.filter((v) => v !== option.id))
              : selected.push(option.id)
          "
        >
          <span
            class="mr-2 flex h-4 w-4 items-center justify-center rounded-sm
              border border-gray-400"
            :class="{
              'bg-primary text-white': selected.includes(option.id)
            }"
          >
            ✓
          </span>
          {{ option.title }}
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command'

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

const emit = defineEmits(['change'])

const search = ref('')
const selected = ref([])

const onSearch = (event) => {
  search.value = event.target.value
}

const filtered = computed(() => {
  if (!search.value) return []

  return props.options.filter((option) =>
    option.title.toLowerCase().includes(search.value.toLowerCase())
  )
})

watch(
  selected,
  (newVal) => {
    emit('change', newVal)
  },
  { deep: true }
)
</script>

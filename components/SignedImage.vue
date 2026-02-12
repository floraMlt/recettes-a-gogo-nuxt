<template>
  <NuxtImg
    v-if="currentUrl"
    :src="currentUrl"
    :alt="alt"
    :class="className"
    :format="format"
    :sizes="sizes"
    @error="handleError"
  />

  <div v-else class="animate-pulse bg-gray-200" :class="className" />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  fileName: {
    type: String,
    default: ''
  },
  initialUrl: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'Recipe image'
  },
  className: {
    type: String,
    default: ''
  },
  format: {
    type: String,
    default: 'webp'
  },
  sizes: {
    type: String,
    default: '(max-width: 500px) 70px, (max-width: 1071px) 14vw, 150px'
  }
})

const currentUrl = ref(props.initialUrl)
const isRegenerating = ref(false)

const handleError = async () => {
  if (isRegenerating.value || !props.fileName) return

  isRegenerating.value = true

  try {
    const { url } = await $fetch(`/api/images/${props.fileName}`)
    currentUrl.value = url
  } catch (error) {
    console.error('Failed to regenerate URL:', error)
  } finally {
    isRegenerating.value = false
  }
}

watch(
  () => props.initialUrl,
  (newUrl) => {
    if (newUrl) currentUrl.value = newUrl
  }
)
</script>

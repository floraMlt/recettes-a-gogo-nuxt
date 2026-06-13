<template>
  <div
    v-if="isLoading && currentUrl"
    v-bind="$attrs"
    class="flex items-center justify-center"
    :class="className"
    :style="{ backgroundImage: 'none' }"
  >
    <SpinnerLoader size="sm" />
  </div>

  <NuxtImg
    v-if="currentUrl"
    v-show="!isLoading"
    v-bind="$attrs"
    :src="currentUrl"
    :alt="alt"
    :class="className"
    :format="format"
    :sizes="sizes"
    @load="isLoading = false"
    @error="handleError"
  />

  <div
    v-if="!currentUrl"
    v-bind="$attrs"
    class="min-h-full"
    :class="className"
  />
</template>

<script setup>
import { ref, watch } from 'vue'

defineOptions({
  inheritAttrs: false
})

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

const currentUrl = ref(props.initialUrl ?? '/img/home2.png')
const isLoading = ref(!!props.initialUrl)
const isRegenerating = ref(false)

const handleError = async () => {
  if (isRegenerating.value || !props.fileName) return

  isRegenerating.value = true

  try {
    const { url } = await $fetch(`/api/images/${props.fileName}`)
    currentUrl.value = url
    isLoading.value = true
  } catch (error) {
    console.error('Failed to regenerate URL:', error)
  } finally {
    isRegenerating.value = false
  }
}

watch(
  () => props.initialUrl,
  (newUrl) => {
    if (newUrl) {
      currentUrl.value = newUrl
      isLoading.value = true
    }
  }
)
</script>

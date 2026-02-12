<template>
  <div class="space-y-4">
    <Label v-if="label">{{ label }}</Label>

    <div
      ref="dropZoneRef"
      :class="[
        'group relative cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-all',
        uploading && 'pointer-events-none opacity-50',
        isOverDropZone
          ? 'border-primary-200 bg-secondary-light'
          : 'hover:bg-secondary-light border-primary-light hover:border-primary-200'
      ]"
      @click="!modelValue && $refs.fileInput.click()"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />

      <div v-if="!modelValue && !uploading">
        <UploadIcon class="mx-auto h-12 w-12 text-gray-400" />
        <p class="mt-2 text-sm text-gray-600">
          Glissez une image ou cliquez pour sélectionner
        </p>
        <p class="mt-1 text-xs text-gray-500">PNG, JPG, WEBP jusqu'à 10MB</p>
      </div>

      <div v-if="uploading">
        <SpinnerLoader size="sm" class="mx-auto" />
        <p class="mt-2 text-sm text-gray-600">Upload en cours...</p>
      </div>

      <div v-if="modelValue && !uploading" class="relative">
        <img
          :src="modelValue"
          alt="Preview"
          class="mx-auto max-h-60 rounded-lg object-contain"
        />
        <div
          class="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <div
            class="group-hover:bg-secondary-light absolute inset-0 opacity-40"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            class="relative z-10 cursor-pointer"
            @click.stop="$refs.fileInput.click()"
          >
            <PenIcon class="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            class="relative z-10 cursor-pointer"
            @click.stop="removeImage"
          >
            <XIcon class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDropZone } from '@vueuse/core'
import { UploadIcon, XIcon, PenIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  maxSize: {
    type: Number,
    default: 10 * 1024 * 1024
  }
})

const modelValue = defineModel({ type: String, default: '' })
const fileName = defineModel('fileName', { type: String, default: '' })
const uploading = ref(false)
const errorMessage = ref('')
const dropZoneRef = ref()

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
})

function onDrop(files) {
  const file = files?.[0]
  if (file) {
    uploadFile(file)
  }
}

const uploadFile = async (file) => {
  errorMessage.value = ''

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Veuillez sélectionner une image'
    return
  }

  if (file.size > props.maxSize) {
    errorMessage.value = `L'image ne doit pas dépasser ${props.maxSize / 1024 / 1024}MB`
    return
  }

  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    modelValue.value = response.url
    fileName.value = response.fileName
  } catch (error) {
    console.error('Upload failed:', error)
    errorMessage.value = "Erreur lors de l'upload. Veuillez réessayer."
  } finally {
    uploading.value = false
  }
}

const handleFileChange = async (event) => {
  const file = event.target.files?.[0]
  if (file) {
    await uploadFile(file)
  }
}

const removeImage = () => {
  modelValue.value = ''
  errorMessage.value = ''
}
</script>

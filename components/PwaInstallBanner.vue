<script setup lang="ts">
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const showBanner = ref(false)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt.value = e as BeforeInstallPromptEvent
    showBanner.value = true
  })

  window.addEventListener('appinstalled', () => {
    showBanner.value = false
    deferredPrompt.value = null
  })
})

async function install() {
  if (!deferredPrompt.value) return
  await deferredPrompt.value.prompt()
  await deferredPrompt.value.userChoice
  deferredPrompt.value = null
  showBanner.value = false
}

function dismiss() {
  showBanner.value = false
}
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="showBanner"
      class="safe-area-bottom fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 shadow-lg"
    >
      <div class="flex items-center gap-3">
        <img
          src="/icon-192.png"
          alt="Icône de l'app"
          class="h-10 w-10 rounded-xl"
        />
        <div>
          <p class="text-sm font-semibold text-gray-900">Recettes à gogo</p>
          <p class="text-xs text-gray-500">Installer l'application</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100"
          @click="dismiss"
        >
          Plus tard
        </button>
        <button
          class="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
          @click="install"
        >
          Installer
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
.safe-area-bottom {
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
}
</style>
